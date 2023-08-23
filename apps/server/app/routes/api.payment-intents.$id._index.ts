import type {LoaderArgs} from '@remix-run/node'
import {typedjson} from 'remix-typedjson'

import {PaymentIntentSchema, UpdatePaymentIntentSchema} from '~/schemas'
import {requireValidApiKey} from '~/utils/auth.server'
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
  const {accountId, mode} = await requireValidApiKey(request)

  const {path} = await contract.loader({params})

  const {id} = path

  const paymentIntent = await prisma.paymentIntent.findUnique({
    where: {
      id,
      accountId,
      mode,
    },
  })

  if (!paymentIntent) {
    throw new Response(`PaymentIntent not found: ${id}`, {
      status: 404,
      statusText: 'PaymentIntent not found',
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
  const {accountId, mode} = await requireValidApiKey(request)

  const {path, body} = await contract.action({request, params})

  const {id} = path

  const paymentIntent = await prisma.paymentIntent.update({
    where: {
      id,
      accountId,
      mode,
    },
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
    tolerance: paymentIntent.tolerance.toNumber(),
  })
}
