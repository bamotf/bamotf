import type {LoaderArgs} from '@remix-run/node'
import {format, logger} from 'logger'
import {typedjson} from 'remix-typedjson'

import {queue} from '~/queues/transaction.server'
import {NewPaymentIntentSchema} from '~/schemas'
import {requireToken} from '~/utils/auth.server'
import {
  addWatchOnlyAddress,
  createWatchOnlyWallet,
  getDescriptor,
} from '~/utils/bitcoin-core'
import {createContract} from '~/utils/contract'
import {prisma} from '~/utils/prisma.server'
import {env} from '../../../../env/env'

export const contract = createContract({
  action: {
    body: NewPaymentIntentSchema,
  },
})

/**
 * Shows a list of all PaymentIntent objects.
 */
export async function loader({request}: LoaderArgs) {
  await requireToken(request)

  const [paymentIntents, total] = await listPaymentIntents()

  return typedjson({
    data: paymentIntents.map(pi => ({
      ...pi,
      amount: pi.amount.toNumber(),
      tolerance: pi.tolerance.toNumber(),
    })),
    total,
  })
}

export async function listPaymentIntents() {
  return await Promise.all([
    prisma.paymentIntent.findMany({
      orderBy: {createdAt: 'desc'},
    }),
    prisma.paymentIntent.count(),
  ])
}

/**
 * Creates a PaymentIntent object.
 */
export async function action({request}: LoaderArgs) {
  await requireToken(request)

  const {body: data} = await contract.action({request})

  const pi = await prisma.paymentIntent.create({
    data: {
      ...data,
      logs: {
        create: [
          {
            status: 'status_created',
          },
        ],
      },
    },
  })

  await createWatchOnlyWallet(pi.id)
  const descriptor = await getDescriptor(pi.address)
  await addWatchOnlyAddress({
    wallet: pi.id,
    descriptor,
  })

  const job = await queue.add('check if payment was made', {
    paymentIntentId: pi.id,
  })

  logger.info(
    `Adding job (${format.magenta(
      job.id,
    )}) to check if payment (${format.magenta(pi.id)}) was made`,
  )

  return typedjson({
    ...pi,
    amount: pi.amount.toNumber(),
    tolerance: pi.tolerance.toNumber(),
  })
}
