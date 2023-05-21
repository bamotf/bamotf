import {prisma} from 'db'
import {logger} from 'logger'
import {Queue} from 'quirrel/next'
import fetch from 'node-fetch'

import {symmetric} from 'secure-webhooks'
import {env} from '../../../api/utils'
import * as bitcoin from '../../../api/utils/bitcoin'

const QUEUE_ID = 'api/queues/transaction' // 👈 the route it's reachable on

export type TransactionQueuePayload = {
  paymentIntentId: string
}

const TransactionQueue = Queue<TransactionQueuePayload>(
  QUEUE_ID,
  async (payload, meta) => {
    logger.info(`▸ Job started for '${QUEUE_ID}'`, {
      data: payload,
      meta,
    })

    const [transactions, paymentIntent] = await Promise.all([
      // Check if the payment was made
      bitcoin.listUnspent(payload.paymentIntentId).catch(_ => []),
      prisma.paymentIntent.findFirst({
        where: {id: payload.paymentIntentId},
      }),
    ])

    if (!paymentIntent) {
      logger.error(`✝︎ Payment intent not found: ${payload.paymentIntentId}`)
      TransactionQueue.delete(meta.id)
      return
    }

    if (paymentIntent.status === 'canceled') {
      logger.error(`✝︎ Payment intent was canceled: ${payload.paymentIntentId}`)
      TransactionQueue.delete(meta.id)
      return
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
          transaction =>
            transaction.confirmations >= paymentIntent.confirmations,
        )
        .reduce((acc, tx) => acc + tx.amount, 0),
      unconfirmed: transactions
        .filter(
          transaction =>
            transaction.confirmations < paymentIntent.confirmations,
        )
        .reduce((acc, tx) => acc + tx.amount, 0),
    }

    const status =
      amountReceived.confirmed >= paymentIntent.amount ? 'succeeded' : 'pending'

    if (status === 'succeeded') {
      const body = {
        id: meta.id,
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
        TransactionQueue.delete(meta.id),
        prisma.paymentIntent.update({
          where: {id: paymentIntent.id},
          data: {
            status,
          },
        }),
      ])

      logger.info(`✓ Job completed for '${QUEUE_ID}'`, {
        data: payload,
        meta,
      })
    }
  },
)

export default TransactionQueue

function triggerSuccessfulWebhook(body: {
  id: string
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
