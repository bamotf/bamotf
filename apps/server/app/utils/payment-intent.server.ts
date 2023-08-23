import {
  prisma,
  type Mode,
  type PaymentIntent,
  type Transaction,
} from '~/utils/prisma.server'

/**
 * List all payment intents for the given account and mode.
 *
 * @param accountId
 * @param mode
 * @returns
 */
export async function listPaymentIntents(accountId: string, mode: Mode) {
  return await Promise.all([
    prisma.paymentIntent.findMany({
      where: {
        accountId,
        mode,
      },
      orderBy: {createdAt: 'desc'},
    }),
    prisma.paymentIntent.count({
      where: {
        accountId,
        mode,
      },
    }),
  ])
}

/**
 * Update the payment intent status according to the given status.
 * It also creates a log entry for the new status.
 *
 * @param paymentIntentId
 * @param status
 */
export function updatePaymentIntentStatus(
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
 * @param props
 * @returns
 */
export function getTotalPaid({
  transactions,
  confirmations,
}: Pick<PaymentIntent, 'confirmations'> & {
  transactions: Array<
    Pick<Transaction, 'confirmations' | 'amount' | 'originalAmount'>
  >
}) {
  const confirmedTransactions = transactions.filter(
    transaction => transaction.confirmations >= confirmations,
  )

  const btc = confirmedTransactions.reduce(
    (acc, tx) => acc + (tx.amount || BigInt(0)),
    BigInt(0),
  )

  const fiat = confirmedTransactions.reduce(
    (acc, tx) => acc + (tx.originalAmount || BigInt(0)),
    BigInt(0),
  )

  return {
    btc,
    fiat,
  }
}

/**
 * Check if the payment intent is considered paid.
 */
export function isPaymentIntentPaid({
  transactions,
  confirmations,
  currency,
  amount,
  tolerance,
}: Pick<
  PaymentIntent,
  'confirmations' | 'currency' | 'amount' | 'tolerance'
> & {
  transactions: Array<
    Pick<Transaction, 'confirmations' | 'amount' | 'originalAmount'>
  >
}) {
  const amountReceived = getTotalPaid({
    transactions,
    confirmations,
  })

  // If the payment intent is in BTC, we can simply compare the amount received
  // to the amount requested
  if (currency === 'BTC') {
    return amountReceived.btc >= amount
  }

  // Subtract the tolerance from 1 to get the percentage of the amount requested
  // that we can consider as paid
  const acceptablePercentage = 1 - tolerance.toNumber()

  // If the PI is in FIAT, we need check if the amount when user first sent the
  // payment is somewhat close to the amount requested
  return amountReceived.fiat >= Number(amount) * acceptablePercentage
}
