import {UnrecoverableError} from 'bullmq'
import {format, logger} from 'logger'

import {
  addWatchOnlyAddress,
  createWatchOnlyWallet,
  getDescriptor,
} from '~/utils/bitcoin-core'
import {prisma} from '~/utils/prisma.server'
import {createQueue} from '~/utils/queue.server'
import {queue as transactionQueue} from './transaction.server'

type QueueData = {
  paymentIntentId: string
}

const QUEUE_ID = 'watch-pi'

/**
 * This queue will start the process to watch when payments are made to a payment intent.
 */
export const queue = createQueue<QueueData>(
  QUEUE_ID,
  async job => {
    const {data: payload} = job
    const {paymentIntentId} = payload

    // Get the address we will watch.
    const {
      address,
      mode: network,
      createdAt: timestamp,
    } = await requirePaymentIntent(paymentIntentId)

    if (network === 'dev') {
      throw new UnrecoverableError('Cannot watch payments in dev mode')
    }

    // Create the watch-only wallet
    await createWatchOnlyWallet({name: paymentIntentId, network})
    logger.debug(`wallet created: ${format.magenta(paymentIntentId)}`)

    // ... and add the address to it through descriptor
    const descriptor = await getDescriptor({address, network})
    await addWatchOnlyAddress({
      wallet: paymentIntentId,
      descriptor,
      network,
      timestamp,
    })

    // after creating the watch-only wallet, we need to add the payment intent to the service
    // that will keep checking for transactions to that address.
    const transactionJob = await transactionQueue.add(
      'check if payment was made',
      {
        paymentIntentId,
      },
    )

    logger.info(
      `Adding job (${format.magenta(
        transactionJob.id,
      )}) to check if payment (${format.magenta(paymentIntentId)}) was made`,
    )
  },
  {
    queue: {
      defaultJobOptions: {
        attempts: 3,
      },
    },
  },
)

/**
 * Require a payment intent by id, or throw an unrecoverable error.
 * @param paymentIntentId
 * @returns
 */
async function requirePaymentIntent(paymentIntentId: string) {
  const paymentIntent = await prisma.paymentIntent.findFirst({
    where: {id: paymentIntentId},
    select: {
      address: true,
      mode: true,
      createdAt: true,
    },
  })

  if (!paymentIntent) {
    throw new UnrecoverableError(
      `Payment intent not found: ${format.red(paymentIntentId)}`,
    )
  }
  return paymentIntent
}
