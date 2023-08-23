import type {LoaderArgs} from '@remix-run/node'
import {format, logger} from 'logger'
import {typedjson} from 'remix-typedjson'

import {queue} from '~/queues/transaction.server'
import {NewPaymentIntentSchema} from '~/schemas'
import {requireValidApiKey} from '~/utils/auth.server'
import {
  addWatchOnlyAddress,
  createWatchOnlyWallet,
  getDescriptor,
} from '~/utils/bitcoin-core'
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
    tolerance: pi.tolerance.toNumber(),
  })
}
