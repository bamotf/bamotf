import {createNextRoute} from '@ts-rest/next'
import {prisma} from 'db'
import {contract} from './contract'
import * as bitcoinCore from './utils/bitcoin-core'
import TransactionQueue from '../pages/api/queues/transaction'
import {logger, format} from 'logger'

export const paymentIntentsRouter = createNextRoute(contract.paymentIntents, {
  create: async args => {
    const {amount, description, address, ...rest} = args.body

    // let accountId: string | null = null
    // if ('address' in rest) {
    //   address = rest.address
    // } else if ('account' in rest) {
    //   // saves the account in the database and gets what is going to be the next derivation path
    //   const account = await getTotalAddressUsedFromAccount(rest.account)

    //   // TODO: derive next address from extended public key
    //   address = 'TODO'
    //   accountId = account.id
    // } else {
    //   throw new Error('Invalid request body, missing address or account.')
    // }

    const pi = await prisma.paymentIntent.create({
      data: {
        amount,
        description,
        address,
        // accountId,
      },
    })

    await bitcoinCore.createWatchOnlyWallet(pi.id)
    const descriptor = await bitcoinCore.getDescriptor(address)
    await bitcoinCore.addWatchOnlyAddress({
      wallet: pi.id,
      descriptor,
    })

    // add job to check if the payment was made
    const job = await TransactionQueue.enqueue(
      {
        paymentIntentId: pi.id,
      },
      {
        repeat: {
          every: '5s',
        },
      },
    )

    logger.debug(
      `
📚 Adding job to check if payment was made:
    ${format.green(job.id)}`,
    )

    return {
      status: 200,
      body: pi,
    }
  },

  list: async () => {
    const [paymentIntents, total] = await Promise.all([
      prisma.paymentIntent.findMany(),
      prisma.paymentIntent.count(),
    ])

    return {
      status: 200,
      body: {
        data: paymentIntents,
        total,
      },
    }
  },

  retrieve: async args => {
    const {id} = args.params

    const pi = await prisma.paymentIntent.findUniqueOrThrow({
      where: {id},
    })

    return {
      status: 200,
      body: pi,
    }
  },

  update: async args => {
    const {id} = args.params

    const pi = await prisma.paymentIntent.update({
      where: {id},
      data: args.body,
    })

    return {
      status: 200,
      body: pi,
    }
  },

  cancel: async args => {
    const {id} = args.params
    const {cancellationReason} = args.body

    const pi = await prisma.paymentIntent.update({
      where: {id},
      data: {status: 'canceled', cancellationReason},
    })

    // TODO: cancelar job de checar se ta pago

    return {
      status: 200,
      body: pi,
    }
  },
})

// /**
//  * Returns the total number of addresses used from an extended public key
//  * (also known as `account`).
//  *
//  * @param extendedPublicKey A BIP32 extended public key
//  * @returns
//  */
// async function getTotalAddressUsedFromAccount(extendedPublicKey: string) {
//   return await prisma.account.upsert({
//     where: {extendedPublicKey},
//     update: {},
//     create: {
//       extendedPublicKey,
//     },
//     include: {
//       _count: {
//         select: {
//           paymentIntents: true,
//         },
//       },
//     },
//   })
// }
