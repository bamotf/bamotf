import {UnrecoverableError} from 'bullmq'
import {format, logger} from 'logger'
import {symmetric} from 'secure-webhooks'
import {v4 as uuidv4} from 'uuid'

import {env} from '~/utils/env.server'
import {prisma, type Prisma} from '~/utils/prisma.server'
import {createQueue} from '~/utils/queue.server'
import type {Event} from './webhook'

type QueueData = {
  webhookId?: string
  paymentIntentId: string
  event: Event
}

const QUEUE_ID = 'webhook-attempt'

/**
 * This queue gets the webhook data and sends it to the webhook url.
 */
export const queue = createQueue<QueueData>(
  QUEUE_ID,
  async job => {
    const {data: payload} = job
    const {paymentIntentId, webhookId, event} = payload

    // Get all the data we need to send to the webhook.
    const paymentIntent = await requirePaymentIntent(paymentIntentId)
    const webhook = await requireWebhook(webhookId)

    // Create the body and signature.
    const body = {
      id: uuidv4(),
      idempotenceKey: job.id!,
      created: new Date().toISOString(),
      event,
      data: {
        paymentIntent: {
          ...paymentIntent,
          amount: paymentIntent.amount.toString(),
          tolerance: paymentIntent.tolerance.toNumber(),
          transactions: paymentIntent.transactions.map(tx => ({
            ...tx,
            amount: tx.amount.toString(),
            originalAmount: tx.originalAmount?.toString(),
          })),
        },
      },
    }

    const bodyString = JSON.stringify(body)
    const signature = symmetric.sign(bodyString, webhook.secret)

    // Send the webhook.
    let result

    try {
      result = await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'x-webhook-signature': signature,
        },
        body: bodyString,
      })
    } catch (error) {
      result = new Response(`Url didn't respond`, {status: 404})
    }

    logger.debug(
      `⚑ Sending webhook to ${format.magenta(webhook.url)}: ${
        result.ok ? format.green('OK') : format.red('FAILED')
      }`,
    )

    // Hacky way to get the response body.
    let response
    try {
      response = await result.clone().json()
    } catch (error) {
      response = await result.text()
    }

    // Save the webhook attempt to the database.
    await prisma.webhookAttempt.create({
      data: {
        webhookId: webhook.id,
        event,
        paymentIntentId,
        status: result.status,
        url: webhook.url,
        body: body as unknown as Prisma.JsonObject,
        response,
      },
    })

    // Retry the job if it failed
    if (!result.ok) {
      throw new Error(
        `Webhook failed: ${format.red(await result.text())} ${format.magenta(
          bodyString,
        )}`,
      )
    }
  },
  {
    queue: {
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      },
    },
  },
)

/**
 * Require a payment intent by id, or throw an unrecoverable error.
 * @param paymentIntentId
 * @returns
 */
async function requirePaymentIntent(paymentIntentId: string) {
  const paymentIntent = await prisma.paymentIntent.findFirst({
    where: {id: paymentIntentId},
    include: {
      transactions: true,
    },
  })

  if (!paymentIntent) {
    throw new UnrecoverableError(
      `Payment intent not found: ${format.red(paymentIntentId)}`,
    )
  }
  return paymentIntent
}

/**
 * Require a webhook by id, or throw an unrecoverable error. If no webhook id is provided, it will return the dev webhook.
 * @param webhookId
 * @returns
 */
async function requireWebhook(webhookId?: string) {
  if (!webhookId && env.DEV_MODE_ENABLED) {
    return {
      id: null,
      url: env.DEV_WEBHOOK_URL,
      secret: env.DEV_WEBHOOK_SECRET,
    }
  }

  const webhook = await prisma.webhook.findUnique({
    where: {id: webhookId},
    select: {
      id: true,
      url: true,
      secret: true,
    },
  })

  if (!webhook) {
    throw new UnrecoverableError(`Webhook not found: ${format.red(webhookId)}`)
  }
  return webhook
}
