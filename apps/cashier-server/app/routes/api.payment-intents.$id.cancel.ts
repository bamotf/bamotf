import type {LoaderArgs} from '@remix-run/node'
import {typedjson} from 'remix-typedjson'
import {PaymentIntentSchema} from '~/schemas'
import {createContract} from '~/utils/contract'
import {prisma} from '~/utils/prisma.server'

export const contract = createContract({
  action: {
    pathParams: PaymentIntentSchema.pick({id: true}),
    body: PaymentIntentSchema.pick({cancellationReason: true}),
  },
})

/**
 * Cancels a PaymentIntent object.
 */
export async function action({request, params}: LoaderArgs) {
  const {path, body} = await contract.action({request, params})

  const {id} = path
  const {cancellationReason} = body

  const pi = await prisma.paymentIntent.update({
    where: {id},
    data: {status: 'canceled', cancellationReason},
  })

  // TODO: cancel the worker

  return typedjson({
    ...pi,
    amount: pi.amount.toNumber(),
    tolerance: pi.tolerance.toNumber(),
  })
}
