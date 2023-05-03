import {Queue} from 'quirrel/next'
import {logger} from 'logger'
import * as bitcoin from '~/api/utils/bitcoin'
import {prisma} from 'db'

type Payload = {
  paymentIntentId: string
}

const EmailQueue = Queue<Payload>(
  'api/queues/email', // 👈 the route it's reachable on
  async (payload, meta) => {
    logger.info(`▸ Job started for 'api/queues/email'`, {data: payload, meta})

    // TODO: move this to a function
    const pi = await prisma.paymentIntent.findUniqueOrThrow({
      where: {id: payload.paymentIntentId},
    })

    // Check if the payment was made
    const transactions = await bitcoin.listUnspent(pi.address)

    // Trigger a webhook for new transaction detected
    // Trigger a webhook for successful payment

    // TODO: Checa quantas confirmacoes
    // TODO: Deletar a wallet do bitcoin core

    if (meta.count >= 2) {
      logger.info(`✓ Job completed for 'api/queues/email'`, {
        data: payload,
        meta,
      })
      EmailQueue.delete(meta.id)
    }
  },
)

export default EmailQueue
