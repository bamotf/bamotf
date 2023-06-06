import type {Prisma} from '@prisma/client'
import type {CurrencyCode, FiatCurrencyCode} from '~/config/currency'
import {getBtcAmountFromFiat} from './price'

interface BitcoinTransaction {
  confirmations: number
  amount: Prisma.Decimal
}

function getSafeConfirmations(amount: number): number {
  if (amount <= 0.001) {
    // 0.001 BTC is a small amount, so 0 confirmations is considered safe
    return 0
  } else if (amount <= 0.01) {
    // 0.01 BTC is a moderate amount, so 1 confirmation is considered safe
    return 1
  } else if (amount <= 1) {
    // 1 BTC is a large amount, so 3 confirmations is considered safe
    return 3
  } else {
    // For any amount over 1 BTC, 6 confirmations is considered safe
    return 6
  }
}

export async function calculateRiskScore({
  amount,
  currency,
  transactions,
  confirmations,
}: {
  amount: Prisma.Decimal
  confirmations: number
  currency: CurrencyCode | string
  transactions: BitcoinTransaction[]
}): Promise<number> {
  const amountInBTC =
    currency === 'BTC'
      ? amount.toNumber()
      : await getBtcAmountFromFiat({
          amount: amount.toNumber(),
          currency: currency as FiatCurrencyCode,
        })

  const safeConfirmations = getSafeConfirmations(amountInBTC)
  const numberOfFactors = 2

  if (safeConfirmations === 0) {
    return 0
  }

  // If there are no transactions, then the risk score is the percentage of
  // confirmations that are necessary to be considered safe.
  if (!transactions.length) {
    if (confirmations >= safeConfirmations) {
      return 0
    }

    return Math.ceil((confirmations / safeConfirmations) * 100)
  }

  const riskScores = transactions.map(transaction => {
    let confirmationFactor = 0

    // If the transaction has less than the safe number of confirmations, then
    // it is considered risky.
    // The risk score is the percentage of confirmations that are missing.
    // For example, if the safe number of confirmations is 6, and the
    // transaction has 3 confirmations, then the risk score is 0.5.
    // If the transaction has 0 confirmations, then the risk score is 1.
    if (transaction.confirmations < safeConfirmations) {
      confirmationFactor =
        (safeConfirmations - transaction.confirmations) / safeConfirmations
    }

    // If the transaction amount is different from the expected amount, then
    // it is considered risky.
    // The risk score is the percentage of the amount that is different.
    // For example, if the expected amount is 1 BTC, and the transaction
    // amount is 0.9 BTC, then the risk score is 0.1.
    // If the transaction amount is 0 BTC, then the risk score is 1.
    const amountDifference = Math.abs(
      amountInBTC - transaction.amount.toNumber(),
    )
    const amountFactor = amountDifference / amountInBTC
    return {confirmationFactor, amountFactor}
  })

  const riskScore = riskScores.reduce(
    (a, b) => a + (b.confirmationFactor + b.amountFactor) / numberOfFactors,
    0,
  )

  const averageRiskScore = riskScore / transactions.length

  return Math.ceil(averageRiskScore * 100)
}
