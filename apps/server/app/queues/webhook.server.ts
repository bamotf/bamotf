import {UnrecoverableError} from 'bullmq'
import {format} from 'logger'

import {prisma} from '~/utils/prisma.server'
import {createQueue} from '~/utils/queue.server'
import type {Event} from './webhook'
import {queue as queueAttempt} from './webhook-attempt.server'

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

  // Get all the data we need to send all webhooks
  const paymentIntent = await prisma.paymentIntent.findFirst({
    where: {id: paymentIntentId},
    select: {accountId: true, mode: true},
  })

  if (!paymentIntent) {
    throw new UnrecoverableError(
      `Payment intent not found: ${format.red(paymentIntentId)}`,
    )
  }

  const {accountId, mode} = paymentIntent

  if (mode === 'dev') {
    return await queueAttempt.add('trigger webhook', {
      event,
      paymentIntentId,
    })
  }

  const webhooks = await prisma.webhook.findMany({
    where: {accountId, mode},
  })

  // Add a job for each webhook
  await queueAttempt.addBulk(
    webhooks.map(webhook => ({
      name: 'trigger each webhook',
      data: {
        event,
        paymentIntentId,
        webhookId: webhook.id,
      },
    })),
  )
})
