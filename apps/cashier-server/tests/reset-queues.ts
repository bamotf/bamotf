import {queue as transactionQueue} from '~/queues/transaction.server'

export default async function resetQueues() {
  await transactionQueue.obliterate({
    force: true,
  })
}
