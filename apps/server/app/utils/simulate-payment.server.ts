import {faker} from '@faker-js/faker'

import {
  isPaymentIntentPaid,
  updatePaymentIntentStatus,
} from '~/utils/payment-intent.server'
import {getBtcAmountFromFiat, getCurrencyValueFromSatoshis} from '~/utils/price'
import {prisma, type PaymentIntent} from '~/utils/prisma.server'
import type {FiatCurrencyCode} from '../../../../config/currency'

/**
 * Simulates a payment for a payment intent
 *
 * @param query query params
 * @param options how much should be paid
 * @returns
 */
export async function simulatePayment(
  {idOrAddress, accountId}: {idOrAddress: string; accountId: string},
  options: Pick<PaymentIntent, 'amount' | 'currency' | 'confirmations'>,
) {
  const pi = await prisma.paymentIntent.findFirst({
    where: {
      accountId,
      mode: 'dev',
      OR: [
        {
          id: idOrAddress,
        },
        {
          address: idOrAddress,
        },
      ],
    },
    include: {transactions: true},
  })

  if (!pi) {
    throw new Response('Payment intent not found', {status: 404})
  }

  if (pi.status === 'succeeded') {
    throw new Response('Payment intent already succeeded', {status: 400})
  }

  if (pi.status === 'canceled') {
    throw new Response('Payment intent already canceled', {status: 400})
  }

  // Generate the amount that should be paid by the fake transaction
  let amount: bigint | null
  let originalAmount: bigint | null

  if (options.currency === 'BTC') {
    amount = options.amount
    originalAmount = null
  } else {
    amount = await getBtcAmountFromFiat({
      amount: options.amount,
      currency: options.currency as FiatCurrencyCode,
    })
    originalAmount = await getCurrencyValueFromSatoshis({
      amount,
      currency: options.currency as FiatCurrencyCode,
    })
  }

  // Create a fake transaction
  pi.transactions.push(
    await prisma.transaction.create({
      data: {
        paymentIntentId: pi.id,
        amount,
        originalAmount,
        confirmations: options.confirmations,
        id: faker.string.uuid(),
      },
    }),
  )
  const isPaid = isPaymentIntentPaid(pi)

  // Update the payment intent status
  let result: Awaited<ReturnType<typeof updatePaymentIntentStatus>> | undefined

  if (!isPaid && pi.status === 'pending') {
    result = await updatePaymentIntentStatus(pi.id, 'processing')
  }

  if (isPaid) {
    result = await updatePaymentIntentStatus(pi.id, 'succeeded')
  }

  return result
}
