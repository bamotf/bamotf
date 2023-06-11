import type {CurrencyCode} from '~/config/currency'
import {prisma} from '~/utils/prisma.server'
import {createRandomAddress} from './bitcoin'

/**
 * Create a fake payment intent in the database
 */
export function paymentIntent(props?: {
  amount?: number
  address?: string
  currency?: CurrencyCode
}) {
  const {amount = 100, address = createRandomAddress(), ...rest} = props || {}

  return prisma.paymentIntent.create({
    data: {
      amount: amount,
      address,
      ...rest,
    },
  })
}
