import {createNextRoute} from '@ts-rest/next'
import {prisma} from 'db'
import {contract} from './contract'
import * as bitcoin from './utils/bitcoin'
import EmailQueue from '../pages/api/queues/email'

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

    await bitcoin.createWatchOnlyWallet(pi.id)
    const descriptor = await bitcoin.getDescriptor(address)
    await bitcoin.addWatchOnlyAddress({
      wallet: pi.id,
      descriptor,
    })

    // TODO: create job que vai ficar checando se ta pago
    EmailQueue.enqueue(
      {
        paymentIntentId: pi.id,
      },
      {
        repeat: {
          every: '5s',
        },
      },
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
      data: {status: 'CANCELLED', cancellationReason},
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
