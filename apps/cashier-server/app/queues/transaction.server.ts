import {UnrecoverableError} from 'bullmq'
import {format, logger} from 'logger'
import type {FiatCurrencyCode} from '~/config/currency'
import {listUnspent} from '~/utils/bitcoin-core'
import {getCurrencyValueFromSatoshis} from '~/utils/price'
import type {Transaction} from '~/utils/prisma.server'
import {Prisma, prisma} from '~/utils/prisma.server'
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
    transactions.map(async tx => {
      const amount = tx.amount

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

  // If there are no transactions, reschedule the job
  if (!savedTransactions.length) {
    return log('rescheduled')
  }

  const amountReceived = getTotalTransferred(
    savedTransactions,
    paymentIntent.confirmations,
  )

  const isPaid = isPaymentIntentPaid({
    amountReceived,
    currency: paymentIntent.currency,
    amountRequested: paymentIntent.amount,
    tolerance: paymentIntent.tolerance,
  })

  if (!isPaid) {
    await updatePaymentIntentStatus(paymentIntentId, 'processing')
    return log('rescheduled')
  }

  await updatePaymentIntentStatus(paymentIntentId, 'succeeded')

  // Trigger a webhook for successful payment
  await webhookQueue.add(
    'trigger success webhook',
    {
      paymentIntentId,
      event: 'payment_intent.succeeded',
    },
    {
      attempts: 3,
    },
  )

  // Remove the job from the queue
  await queue.removeRepeatableByKey(job.repeatJobKey!)

  return log('completed')
})

function updatePaymentIntentStatus(
  paymentIntentId: string,
  status: 'processing' | 'succeeded',
) {
  return prisma.paymentIntent.update({
    where: {id: paymentIntentId},
    data: {
      status,
      logs: {
        create: [
          {
            status: `status_${status}`,
          },
        ],
      },
    },
  })
}

/**
 * Get the total amount received in the given transactions.
 *
 * @param transactions list of transactions
 * @param confirmations number of block confirmations required for the payment to be considered confirmed
 * @returns
 */
function getTotalTransferred(
  transactions: Transaction[],
  confirmations: number,
) {
  const confirmedTransactions = transactions.filter(
    transaction => transaction.confirmations >= confirmations,
  )

  const unconfirmedTransactions = transactions.filter(
    transaction => transaction.confirmations < confirmations,
  )

  const btc = {
    confirmed: getTotal(confirmedTransactions),
    unconfirmed: getTotal(unconfirmedTransactions),
  }

  const fiat = {
    confirmed: getTotal(confirmedTransactions, 'originalAmount'),
    unconfirmed: getTotal(unconfirmedTransactions, 'originalAmount'),
  }

  logger.debug(
    `🟠 Amount received: ${format.yellow(
      btc.confirmed,
    )} satoshis (confirmed) + ${format.yellow(
      btc.unconfirmed,
    )} satoshis (unconfirmed)`,
  )

  logger.debug(
    `            FIAT   ${format.yellow(
      fiat.confirmed,
    )} (confirmed) + ${format.yellow(fiat.unconfirmed)} (unconfirmed)`,
  )

  return {btc, fiat}
}

/**
 * Simply sums the given key in the given transactions.
 *
 * @param transactions
 * @param key
 * @returns
 */
function getTotal(
  transactions: Transaction[],
  key: 'amount' | 'originalAmount' = 'amount',
) {
  return transactions.reduce(
    (acc, tx) => acc.add(tx[key] || 0),
    new Prisma.Decimal(0),
  )
}

/**
 * Check if the payment intent is considered paid.
 */
function isPaymentIntentPaid({
  amountReceived,
  currency,
  amountRequested,
  tolerance,
}: {
  amountReceived: ReturnType<typeof getTotalTransferred>
  currency: string
  amountRequested: Prisma.Decimal
  tolerance: Prisma.Decimal
}) {
  // If the payment intent is in BTC, we can simply compare the amount received
  // to the amount requested
  if (currency === 'BTC') {
    return amountReceived.btc.confirmed.gte(amountRequested)
  }

  // Subtract the tolerance from 1 to get the percentage of the amount requested
  // that we can consider as paid
  const acceptablePercentage = new Prisma.Decimal(1).sub(tolerance)

  // If the PI is in FIAT, we need check if the amount when user first sent the
  // payment is somewhat close to the amount requested
  return amountReceived.fiat.confirmed.gte(
    amountRequested.mul(acceptablePercentage),
  )
}
