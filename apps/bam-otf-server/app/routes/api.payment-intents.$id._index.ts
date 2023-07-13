import type {LoaderArgs} from '@remix-run/node'
import {typedjson} from 'remix-typedjson'

import {PaymentIntentSchema, UpdatePaymentIntentSchema} from '~/schemas'
import {requireToken} from '~/utils/auth.server'
import {createContract} from '~/utils/contract'
import {prisma} from '~/utils/prisma.server'

export const contract = createContract({
  loader: {
    pathParams: PaymentIntentSchema.pick({id: true}),
  },
  action: {
    pathParams: PaymentIntentSchema.pick({id: true}),
    body: UpdatePaymentIntentSchema,
  },
})

/**
 * Retrieves a PaymentIntent object.
 */
export async function loader({request, params}: LoaderArgs) {
  await requireToken(request)

  const {path} = await contract.loader({params})

  const {id} = path

  const paymentIntent = await prisma.paymentIntent.findUnique({
    where: {id},
  })

  if (!paymentIntent) {
    throw new Response('Payment intent not found', {
      status: 404,
      statusText: 'Not Found',
    })
  }

  return typedjson({
    ...paymentIntent,
    tolerance: paymentIntent.tolerance.toNumber(),
  })
}

/**
 * Updates a PaymentIntent object.
 */
export async function action({request, params}: LoaderArgs) {
  await requireToken(request)

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
  // TODO: handle not found error.code='P2025'

  return typedjson({
    ...paymentIntent,
    tolerance: paymentIntent.tolerance.toNumber(),
  })
}
