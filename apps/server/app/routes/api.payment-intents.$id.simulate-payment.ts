import {faker} from '@faker-js/faker'
import {type LoaderArgs} from '@remix-run/node'
import {typedjson} from 'remix-typedjson'

import {queue as webhookQueue} from '~/queues/webhook.server'
import {PaymentIntentSchema} from '~/schemas'
import {requireValidApiKey} from '~/utils/auth.server'
import {createContract} from '~/utils/contract'
import {env} from '~/utils/env.server'
import {
  isPaymentIntentPaid,
  updatePaymentIntentStatus,
} from '~/utils/payment-intent.server'
import {getBtcAmountFromFiat, getCurrencyValueFromSatoshis} from '~/utils/price'
import {prisma} from '~/utils/prisma.server'
import type {FiatCurrencyCode} from '../../../../config/currency'

export const contract = createContract({
  action: {
    pathParams: PaymentIntentSchema.pick({id: true}),
    body: PaymentIntentSchema.pick({
      amount: true,
      currency: true,
      confirmations: true,
    }),
  },
})

/**
 * Cancels a PaymentIntent object.
 */
export async function action({request, params}: LoaderArgs) {
  if (!env.DEV_MODE_ENABLED) {
    throw new Response(
      'Payment intent simulation is only available in dev mode',
      {status: 400},
    )
  }

  const {accountId, mode} = await requireValidApiKey(request)

  const {path, body} = await contract.action({request, params})

  const {id} = path

  const pi = await prisma.paymentIntent.findUnique({
    where: {id, accountId, mode},
    include: {transactions: true},
  })

  if (!pi) {
    throw new Response('Payment intent not found', {status: 404})
  }

  if (mode !== 'dev') {
    throw new Response(
      `You can not simulate a payment from a '${mode}' payment intent. Those payments rely on the blockchain to be confirmed.`,
    )
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

  if (body.currency === 'BTC') {
    amount = body.amount
    originalAmount = null
  } else {
    amount = await getBtcAmountFromFiat({
      amount: body.amount,
      currency: body.currency as FiatCurrencyCode,
    })
    originalAmount = await getCurrencyValueFromSatoshis({
      amount,
      currency: body.currency as FiatCurrencyCode,
    })
  }

  // Create a fake transaction
  pi.transactions.push(
    await prisma.transaction.create({
      data: {
        paymentIntentId: pi.id,
        amount,
        originalAmount,
        confirmations: body.confirmations,
        id: faker.string.uuid(),
      },
    }),
  )

  // Update the payment intent status
  let {transactions, ...result} = pi

  const isPaid = isPaymentIntentPaid(pi)
  if (!isPaid && pi.status === 'pending') {
    result = await updatePaymentIntentStatus(pi.id, 'processing')
    // TODO: call webhook with payment_intent.processing
  }
  if (isPaid) {
    result = await updatePaymentIntentStatus(pi.id, 'succeeded')
  }

  // TODO: call webhook with payment_intent.processing
  // Call webhook
  await webhookQueue.add('trigger success webhook', {
    paymentIntentId: pi.id,
    event: 'payment_intent.succeeded',
  })

  return typedjson(result)
}
