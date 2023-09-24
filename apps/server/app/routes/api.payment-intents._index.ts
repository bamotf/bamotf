import type {LoaderArgs} from '@remix-run/node'
import {format, logger} from 'logger'
import {typedjson} from 'remix-typedjson'

import {queue} from '~/queues/watch-pi.server'
import {NewPaymentIntentSchema} from '~/schemas'
import {requireValidApiKey} from '~/utils/auth.server'
import {createContract} from '~/utils/contract'
import {listPaymentIntents} from '~/utils/payment-intent.server'
import {prisma} from '~/utils/prisma.server'

export const contract = createContract({
  action: {
    body: NewPaymentIntentSchema,
  },
})

/**
 * Shows a list of all PaymentIntent objects.
 */
export async function loader({request}: LoaderArgs) {
  const {accountId, mode} = await requireValidApiKey(request)

  const [paymentIntents, total] = await listPaymentIntents(accountId, mode)

  return typedjson({
    data: paymentIntents,
    total,
  })
}

/**
 * Creates a PaymentIntent object.
 */
export async function action({request}: LoaderArgs) {
  const {accountId, mode} = await requireValidApiKey(request)

  const {body: data} = await contract.action({request})

  const pi = await prisma.paymentIntent.create({
    data: {
      ...data,
      mode,
      accountId,
      logs: {
        create: [
          {
            status: 'status_created',
          },
        ],
      },
    },
  })

  if (mode === 'dev') {
    return typedjson({
      ...pi,
      tolerance: pi.tolerance.toNumber(),
    })
  }

  // If we are not in dev mode, we need to add the PI to
  // the service that will watch for payments.
  await queue.add('watch payments', {
    paymentIntentId: pi.id,
  })

  return typedjson({
    ...pi,
    tolerance: pi.tolerance.toNumber(),
  })
}
