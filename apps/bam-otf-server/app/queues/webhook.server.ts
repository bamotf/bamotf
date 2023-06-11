import {UnrecoverableError} from 'bullmq'
import {format, logger} from 'logger'
import {symmetric} from 'secure-webhooks'
import {v4 as uuidv4} from 'uuid'

import {env} from '~/utils/env.server'
import {prisma, type Prisma} from '~/utils/prisma.server'
import {QueueLog} from '~/utils/queue-log'
import {createQueue} from '~/utils/queue.server'

type Event = 'payment_intent.succeeded'

type QueueData = {
  paymentIntentId: string
  event: Event
}

const QUEUE_ID = 'webhook'

/**
 * This queue checks if the wallet has a new transaction and updates the database accordingly.
 * It also triggers a webhook if the payment was successful.
 */
export const queue = createQueue<QueueData>(QUEUE_ID, async job => {
  const {data: payload} = job
  const {paymentIntentId, event} = payload

  const log = QueueLog(QUEUE_ID, paymentIntentId)
  log('started')

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

  const body = {
    id: uuidv4(),
    idempotenceKey: job.id!,
    created: new Date().toISOString(),
    event,
    data: {
      paymentIntent: {
        ...paymentIntent,
        amount: paymentIntent.amount.toNumber(),
        tolerance: paymentIntent.tolerance.toNumber(),
        transactions: paymentIntent.transactions.map(tx => ({
          ...tx,
          amount: tx.amount.toNumber(),
          originalAmount: tx.originalAmount?.toNumber(),
        })),
      },
    },
  }

  const bodyString = JSON.stringify(
    body,
    (key, value) => (typeof value === 'bigint' ? value.toString() : value), // return everything else unchanged
  )
  const signature = symmetric.sign(bodyString, env.WEBHOOK_SECRET)

  const result = await fetch(env.WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'x-webhook-signature': signature,
    },
    body: bodyString,
  })

  logger.debug(
    `⚑ Sending webhook to ${format.magenta(env.WEBHOOK_URL)}: ${
      result.ok ? format.green('OK') : format.red('FAILED')
    }`,
  )

  let response
  try {
    response = await result.clone().json()
  } catch (error) {
    response = await result.text()
  }
  await prisma.webhookAttempt.create({
    data: {
      event,
      paymentIntentId,
      status: result.status,
      url: env.WEBHOOK_URL,
      body: body as unknown as Prisma.JsonObject,
      response,
    },
  })

  if (!result.ok) {
    throw new Error(
      `Webhook failed: ${format.red(await result.text())} ${format.magenta(
        bodyString,
      )}`,
    )
  }

  log('completed')
})
