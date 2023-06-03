import {UnrecoverableError} from 'bullmq'
import {format, logger} from 'logger'
import {listUnspent} from '~/utils/bitcoin-core'
import {prisma} from '~/utils/prisma.server'
import {QueueLog} from '~/utils/queue-log'
import {createQueue} from '~/utils/queue.server'
import {queue as webhookQueue} from './webhook.server'

type QueueData = {
  paymentIntentId: string
}

const QUEUE_ID = 'transaction'

/**
 * This queue checks if the wallet has a new transaction and updates the database accordingly.
 * It also triggers a webhook if the payment was successful.
 */
export const queue = createQueue<QueueData>(QUEUE_ID, async job => {
  const {data: payload} = job
  const {paymentIntentId} = payload

  const log = QueueLog(QUEUE_ID, paymentIntentId)
  log('started')

  const [transactions, paymentIntent] = await Promise.all([
    // Check if the payment was made
    listUnspent(paymentIntentId),
    prisma.paymentIntent.findFirst({
      where: {id: paymentIntentId},
    }),
  ])

  if (!paymentIntent) {
    throw new UnrecoverableError(
      `Payment intent not found: ${format.red(paymentIntentId)}`,
    )
  }

  if (paymentIntent.status === 'canceled') {
    throw new UnrecoverableError(
      `Payment intent was canceled ${format.red(paymentIntentId)}`,
    )
  }

  logger.debug(
    `🟠 Payment intent: ${format.magenta(paymentIntentId)} has ${format.yellow(
      transactions.length,
    )} transactions`,
  )

  // Update the local database with transaction history
  const savedTransactions = await Promise.all(
    transactions.map(tx => {
      const amount = BigInt(tx.amount * 1e8)

      return prisma.transaction.upsert({
        where: {id: tx.txid},
        create: {
          id: tx.txid,
          amount,
          confirmations: tx.confirmations,
          paymentIntentId: paymentIntent.id,
        },
        update: {
          amount,
          confirmations: tx.confirmations,
        },
      })
    }),
  )

  const amountReceived = {
    confirmed: savedTransactions
      .filter(
        transaction => transaction.confirmations >= paymentIntent.confirmations,
      )
      .reduce((acc, tx) => acc + tx.amount, BigInt(0)),
    unconfirmed: savedTransactions
      .filter(
        transaction => transaction.confirmations < paymentIntent.confirmations,
      )
      .reduce((acc, tx) => acc + tx.amount, BigInt(0)),
  }

  logger.debug(
    `🟠 Amount received: ${format.yellow(
      amountReceived.confirmed,
    )} satoshis (confirmed) + ${format.yellow(
      amountReceived.unconfirmed,
    )} satoshis (unconfirmed)`,
  )

  const status =
    amountReceived.confirmed >= paymentIntent.amount ? 'succeeded' : 'pending'

  if (status === 'succeeded') {
    // Update the payment intent status
    await prisma.paymentIntent.update({
      where: {id: paymentIntentId},
      data: {
        status,
      },
    })

    // Trigger a webhook for successful payment
    await webhookQueue.add(
      'trigger webhook',
      {
        paymentIntentId,
        events: ['payment_intent.succeeded'],
      },
      {
        attempts: 3,
      },
    )

    // Remove the job from the queue
    await queue.removeRepeatableByKey(job.repeatJobKey!)

    return log('completed')
  }
})
