import {createNextRoute} from '@ts-rest/next'
import {contract} from './contract'
import {prisma} from 'db'

export const paymentIntentsRouter = createNextRoute(contract.paymentIntents, {
  createPaymentIntent: async args => {
    const {amount} = args.body

    const pi = await prisma.paymentIntent.create({
      data: {
        amount,
      },
    })

    return {
      status: 200,
      body: pi,
    }
  },

  listAllPaymentIntents: async () => {
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

  getPaymentIntent: async args => {
    const {id} = args.params

    const pi = await prisma.paymentIntent.findUniqueOrThrow({
      where: {id},
    })

    return {
      status: 200,
      body: pi,
    }
  },

  updatePaymentIntent: async args => {
    const {id} = args.params
    const {amount} = args.body

    const pi = await prisma.paymentIntent.update({
      where: {id},
      data: {amount},
    })

    return {
      status: 200,
      body: pi,
    }
  },

  cancelPaymentIntent: async args => {
    const {id} = args.params

    const pi = await prisma.paymentIntent.update({
      where: {id},
      data: {status: 'CANCELLED'},
    })

    return {
      status: 200,
      body: pi,
    }
  },
})
