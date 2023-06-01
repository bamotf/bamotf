import {LoaderArgs} from '@remix-run/node'
import {prisma} from '~/utils/prisma.server'
import {createContract} from '~/utils/contract'
import {PaymentIntentSchema} from '~/schemas'
import * as bitcoinCore from '~/utils/bitcoin-core'
import {queue} from '~/queues/transaction.server'
import {format, logger} from 'logger'
import {typedjson} from 'remix-typedjson'

export const contract = createContract({
  action: {
    body: PaymentIntentSchema.pick({
      amount: true,
      description: true,
      address: true,
    }),
  },
})

/**
 * Shows a list of all PaymentIntent objects.
 */
export async function loader({}: LoaderArgs) {
  const [paymentIntents, total] = await Promise.all([
    prisma.paymentIntent.findMany(),
    prisma.paymentIntent.count(),
  ])

  return typedjson({
    data: paymentIntents,
    total,
  })
}

/**
 * Creates a PaymentIntent object.
 */
export async function action({request, params}: LoaderArgs) {
  const {body} = await contract.action({request})

  const {amount, description, address, ...rest} = body
  const pi = await prisma.paymentIntent.create({
    data: {
      amount,
      description,
      address,
    },
  })

  await bitcoinCore.createWatchOnlyWallet(pi.id)
  const descriptor = await bitcoinCore.getDescriptor(address)
  await bitcoinCore.addWatchOnlyAddress({
    wallet: pi.id,
    descriptor,
  })

  const job = await queue.add(
    'check if payment was made',
    {
      paymentIntentId: pi.id,
    },
    {
      repeat: {
        every: 10000,
      },
    },
  )

  logger.info(
    `Adding job (${format.cyan(job.id)}) to check if payment (${format.cyan(
      pi.id,
    )}) was made`,
  )

  return typedjson(pi)
}
