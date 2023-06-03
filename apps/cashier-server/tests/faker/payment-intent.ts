import {prisma} from '~/utils/prisma.server'
import {createRandomP2SHAddress} from './bitcoin'

/**
 * Create a fake payment intent in the database
 */
export function createFakePaymentIntent(props?: {
  amount?: number
  address?: string
}) {
  const {amount = 100, address = createRandomP2SHAddress()} = props || {}

  return prisma.paymentIntent.create({
    data: {
      amount: amount,
      address,
    },
  })
}
