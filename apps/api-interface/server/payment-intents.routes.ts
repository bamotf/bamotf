import {createNextRoute} from '@ts-rest/next'
import {contract} from './contract'
import {prisma} from 'db'

export const paymentIntentsRouter = createNextRoute(contract.paymentIntents, {
  create: async args => {
    let address: string

    if ('address' in args.body) {
      address = args.body.address
    } else if ('account' in args.body) {
      const {account: extendedPublicKey} = args.body
      // saves the account in the database and gets what is going to be the next derivation path
      const account = await prisma.account.upsert({
        where: {extendedPublicKey},
        update: {},
        create: {
          extendedPublicKey,
        },
        include: {
          _count: {
            select: {
              PaymentIntent: true,
            },
          },
        },
      })

      // derive next address from extended public key
      // TODO: use BIP44 path
      address = '123'
    } else {
      throw new Error('Invalid request body, missing address or account.')
    }

    const pi = await prisma.paymentIntent.create({
      data: {
        amount: args.body.amount,
        description: args.body.description,
        address,
      },
    })

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

    return {
      status: 200,
      body: pi,
    }
  },
})
