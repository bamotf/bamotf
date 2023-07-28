import {UnrecoverableError} from 'bullmq'
import {format} from 'logger'

import {prisma} from '~/utils/prisma.server'
import {createQueue} from '~/utils/queue.server'
import {queue as queueAttempt} from './webhook-attempt.server'

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

  // Get all the data we need to send all webhooks
  const accountId = await getAccountIdFromPI(paymentIntentId)
  const webhooks = await prisma.webhook.findMany({
    where: {accountId},
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

/**
 * Get the account id from the payment intent id, or throw an error if it doesn't exist.
 * @param paymentIntentId
 * @returns
 */
async function getAccountIdFromPI(paymentIntentId: string) {
  const paymentIntent = await prisma.paymentIntent.findFirst({
    where: {id: paymentIntentId},
    select: {accountId: true},
  })

  if (!paymentIntent) {
    throw new UnrecoverableError(
      `Payment intent not found: ${format.red(paymentIntentId)}`,
    )
  }
  return paymentIntent.accountId
}
