import {currency} from '@bamotf/utils'
import {UnrecoverableError} from 'bullmq'
import {format, logger} from 'logger'

import {listUnspent} from '~/utils/bitcoin-core'
import {
  isPaymentIntentPaid,
  updatePaymentIntentStatus,
} from '~/utils/payment-intent.server'
import {getCurrencyValueFromSatoshis} from '~/utils/price'
import {prisma} from '~/utils/prisma.server'
import {createQueue} from '~/utils/queue.server'
import type {FiatCurrencyCode} from '../../../../config/currency'

type QueueData = {
  paymentIntentId: string
}

const QUEUE_ID = 'transaction'

/**
 * This queue checks if the wallet has a new transaction and updates the database accordingly.
 * It also triggers a webhook if the payment was successful.
 */
export const queue = createQueue<QueueData>(
  QUEUE_ID,
  async job => {
    const {data: payload} = job
    const {paymentIntentId} = payload
    const paymentIntent = await prisma.paymentIntent.findFirst({
      where: {id: paymentIntentId},
    })

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

    if (paymentIntent.mode === 'dev') {
      throw new UnrecoverableError(
        `Payment intent ${format.red(
          paymentIntentId,
        )} is in dev mode therefore should not be monitored`,
      )
    }

    const transactions = await listUnspent({
      wallet: paymentIntentId,
      network: paymentIntent.mode,
    })

    // If there are no transactions, reschedule the job
    if (!transactions.length) {
      throw new Error('No transactions found')
    }

    logger.debug(
      `🟠 Address: ${format.cyan(paymentIntent.address)} has ${format.yellow(
        transactions.length,
      )} transactions`,
    )

    // Update the local database with transaction history
    const savedTransactions = await Promise.all(
      transactions.map(async tx => {
        const amount = currency.convertToBigInt({
          amount: tx.amount,
          currency: 'BTC',
        })

        // If the currency is BTC, we don't need to convert the amount
        // because it's already in satoshis
        // Otherwise, we need to convert it to the original currency
        // so we can determine if the payment was successful in
        // the original currency
        const originalAmount =
          paymentIntent.currency === 'BTC'
            ? null
            : await getCurrencyValueFromSatoshis({
                amount,
                currency: paymentIntent.currency as FiatCurrencyCode,
              })

        return prisma.transaction.upsert({
          where: {id: tx.txid},
          create: {
            id: tx.txid,
            amount,
            confirmations: tx.confirmations,
            paymentIntentId: paymentIntent.id,
            originalAmount,
          },
          update: {
            amount,
            confirmations: tx.confirmations,
          },
        })
      }),
    )

    // // If there are no NEW transactions, reschedule the job
    // const oldTransactionIds = await prisma.transaction.findMany({
    //   where: {paymentIntentId},
    //   select: {id: true},
    // })
    // const hasNewItem = transactions.some(
    //   transaction => !oldTransactionIds.find(({id}) => id === transaction.txid),
    // )
    // if (!hasNewItem) {
    //   throw new Error('No new transactions found')
    // }

    const isPaid = isPaymentIntentPaid({
      ...paymentIntent,
      transactions: savedTransactions,
    })

    if (!isPaid) {
      if (paymentIntent.status === 'processing') {
        throw new Error('Nothing changed')
      }
      await updatePaymentIntentStatus(paymentIntentId, 'processing')
      throw new Error('Payment not confirmed yet')
    }

    await updatePaymentIntentStatus(paymentIntentId, 'succeeded')
  },
  {
    queue: {
      defaultJobOptions: {
        attempts: Number.MAX_SAFE_INTEGER,
        backoff: {
          // TODO: add more delay as it go to test and production
          //  delay: 1000 * 60 * 5, // 5 minutes
          delay: 1000, // 1 second
          type: 'fixed',
        },
        removeOnFail: false,
      },
    },
  },
)
