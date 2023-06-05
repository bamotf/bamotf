import {queue as transactionQueue} from '~/queues/transaction.server'
import {queue as webhookQueue} from '~/queues/webhook.server'

export default async function resetQueues() {
  const config = {
    force: true,
  }
  await transactionQueue.obliterate(config)
  await webhookQueue.obliterate(config)
}
