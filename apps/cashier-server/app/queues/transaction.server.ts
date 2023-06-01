import {Queue} from '~/utils/queue.server'

import {prisma} from '~/utils/prisma.server'
import {format, logger} from 'logger'

import {symmetric} from 'secure-webhooks'
import {env} from '~/utils/env.server'

import {v4 as uuidv4} from 'uuid'

import * as bitcoinCore from '~/utils/bitcoin-core'

type QueueData = {
  paymentIntentId: string
}

const QUEUE_ID = 'transaction'

/**
 * This queue checks if the wallet has a new transaction and updates the database accordingly.
 * It also triggers a webhook if the payment was successful.
 */
export const queue = Queue<QueueData>(QUEUE_ID, async job => {
  const {data: payload, id} = job

  const log = QueueLog(QUEUE_ID, payload, 'paymentIntentId')
  log('started')

  const [transactions, paymentIntent] = await Promise.all([
    // Check if the payment was made
    bitcoinCore.listUnspent(payload.paymentIntentId),
    prisma.paymentIntent.findFirst({
      where: {id: payload.paymentIntentId},
    }),
  ])

  if (!paymentIntent) {
    logger.error(
      `${format.red('✝︎ Payment intent not found')}: ${format.dim(
        payload.paymentIntentId,
      )}`,
    )
    return await job.discard()
  }

  if (paymentIntent.status === 'canceled') {
    logger.error(
      `${format.red('✝︎ Payment intent was canceled')}: ${format.dim(
        payload.paymentIntentId,
      )}`,
    )
    return await job.discard()
  }

  // Update the local database with transaction history
  await Promise.all(
    transactions.map(tx =>
      prisma.transaction.upsert({
        where: {id: tx.txid},
        create: {
          amount: tx.amount,
          confirmations: tx.confirmations,
          paymentIntentId: paymentIntent.id,
        },
        update: {
          amount: tx.amount,
          confirmations: tx.confirmations,
        },
      }),
    ),
  )

  const amountReceived = {
    confirmed: transactions
      .filter(
        transaction => transaction.confirmations >= paymentIntent.confirmations,
      )
      .reduce((acc, tx) => acc + tx.amount, 0),
    unconfirmed: transactions
      .filter(
        transaction => transaction.confirmations < paymentIntent.confirmations,
      )
      .reduce((acc, tx) => acc + tx.amount, 0),
  }

  const status =
    amountReceived.confirmed >= paymentIntent.amount ? 'succeeded' : 'pending'

  if (status === 'succeeded') {
    const body = {
      id: uuidv4(),
      idempotenceKey: job.id!,
      data: {
        paymentIntent: {
          ...paymentIntent,
          status,
        },
        amountReceived,
      },
    }

    await Promise.all([
      // Trigger a webhook for successful payment
      await triggerSuccessfulWebhook(body),
      job.remove(),
      prisma.paymentIntent.update({
        where: {id: paymentIntent.id},
        data: {
          status,
        },
      }),
    ])

    return log('completed')
  }

  log('rescheduled')
})

/**
 * Logs a specific for a queue.
 *
 * @param queueName Queue name
 * @param payload Data to be logged
 * @param prop Prop of the payload to be logged as ID
 * @returns
 */
function QueueLog<T extends object, TProp extends keyof T>(
  queueName: string,
  payload: T,
  prop: TProp,
) {
  const name = {
    started: '▸ Job started',
    completed: '✓ Job completed',
    rescheduled: '♺ Job rescheduled',
  }

  return (status: keyof typeof name) => {
    logger.info(
      `[${format.yellow(queueName)}] ${name[status]}: ${format.cyan(
        payload[prop],
      )}`,
    )
  }
}

function triggerSuccessfulWebhook(body: {
  id: string
  idempotenceKey: string
  data: {
    paymentIntent: {
      status: string
      id: string
      address: string
      amount: bigint
      canceledAt: Date | null
      cancellationReason: string | null
      description: string | null
      confirmations: number
      createdAt: Date
      updatedAt: Date
    }
    amountReceived: {
      confirmed: number
      unconfirmed: number
    }
  }
}) {
  logger.debug(`⚑ Sending webhook to '${env.CASHIER_WEBHOOK_URL}'`)

  const bodyString = JSON.stringify(body)

  const signature = symmetric.sign(bodyString, env.CASHIER_SECRET)

  return fetch(env.CASHIER_WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'x-webhook-signature': signature,
    },
    body: bodyString,
  })
}
