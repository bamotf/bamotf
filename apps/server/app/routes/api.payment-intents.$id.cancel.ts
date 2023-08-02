import type {LoaderArgs} from '@remix-run/node'
import {typedjson} from 'remix-typedjson'

import {PaymentIntentSchema} from '~/schemas'
import {requireValidApiKey} from '~/utils/auth.server'
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
  const {accountId, mode} = await requireValidApiKey(request)

  const {path, body} = await contract.action({request, params})

  const {id} = path
  const {cancellationReason} = body

  const pi = await prisma.paymentIntent.update({
    where: {id, accountId, mode},
    data: {
      status: 'canceled',
      cancellationReason,
      canceledAt: new Date(),
      logs: {create: [{status: 'status_canceled'}]},
    },
  })

  // TODO: cancel the worker

  return typedjson({
    ...pi,
    tolerance: pi.tolerance.toNumber(),
  })
}
