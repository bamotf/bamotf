import type {LoaderArgs} from '@remix-run/node'
import {typedjson} from 'remix-typedjson'

import {PaymentIntentSchema} from '~/schemas'
import {createContract} from '~/utils/contract'
import {prisma} from '~/utils/prisma.server'

export const contract = createContract({
  loader: {
    pathParams: PaymentIntentSchema.pick({id: true}),
  },
  action: {
    pathParams: PaymentIntentSchema.pick({id: true}),
    body: PaymentIntentSchema.pick({
      amount: true,
      address: true,
      description: true,
      currency: true,
      confirmations: true,
      tolerance: true,
    }).partial(),
  },
})

/**
 * Retrieves a PaymentIntent object.
 */
export async function loader({params}: LoaderArgs) {
  const {path} = await contract.loader({params})

  const {id} = path

  const paymentIntent = await prisma.paymentIntent.findUniqueOrThrow({
    where: {id},
  })

  return typedjson({
    ...paymentIntent,
    amount: paymentIntent.amount.toNumber(),
    tolerance: paymentIntent.tolerance.toNumber(),
  })
}

/**
 * Updates a PaymentIntent object.
 */
export async function action({request, params}: LoaderArgs) {
  const {path, body} = await contract.action({request, params})

  const {id} = path

  const paymentIntent = await prisma.paymentIntent.update({
    where: {id},
    data: {
      ...body,
      logs: {
        create: [
          {
            status: 'modified',
          },
        ],
      },
    },
  })

  return typedjson({
    ...paymentIntent,
    amount: paymentIntent.amount.toNumber(),
    tolerance: paymentIntent.tolerance.toNumber(),
  })
}
