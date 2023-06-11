import {PrismaClient} from '@prisma/client'

import {createRandomAddress} from '../tests/faker/bitcoin'

const prisma = new PrismaClient()

async function main() {
  const s1 = await prisma.paymentIntent.upsert({
    where: {id: 'seed-1'},
    update: {},
    create: {
      id: 'seed-1',
      amount: 1,
      description: 'User has not paid',
      address: createRandomAddress(),
    },
  })

  const s2 = await prisma.paymentIntent.upsert({
    where: {id: 'seed-2'},
    update: {},
    create: {
      id: 'seed-2',
      amount: 420.69,
      address: createRandomAddress(),
      status: 'succeeded',
      description: 'User has paid',
      transactions: {
        create: [
          {
            id: 'transaction-1',
            amount: 420.69,
            confirmations: 6,
          },
        ],
      },
    },
  })

  const s3 = await prisma.paymentIntent.upsert({
    where: {id: 'seed-3'},
    update: {},
    create: {
      id: 'seed-3',
      amount: 0.10_002_001,
      address: createRandomAddress(),
      confirmations: 6,
      description: 'Not enough confirmations',
      status: 'processing',
      transactions: {
        create: [
          {
            id: 'transaction-2',
            amount: 0.10_002_001,
            confirmations: 2,
          },
        ],
      },
    },
  })

  const s4 = await prisma.paymentIntent.upsert({
    where: {id: 'seed-4'},
    update: {},
    create: {
      id: 'seed-4',
      amount: 10,
      address: createRandomAddress(),
      description: "User has paid but we haven't received enough funds",
      status: 'processing',
      transactions: {
        create: [
          {
            id: 'transaction-3',
            amount: 1,
            confirmations: 6,
          },
        ],
      },
    },
  })

  const s5 = await prisma.paymentIntent.upsert({
    where: {id: 'seed-5'},
    update: {},
    create: {
      id: 'seed-5',
      amount: 10_000,
      address: createRandomAddress(),
      currency: 'USD',
      description: 'Requested in another currency',
    },
  })

  const s6 = await prisma.paymentIntent.upsert({
    where: {id: 'seed-6'},
    update: {},
    create: {
      id: 'seed-6',
      amount: 130.99,
      address: createRandomAddress(),
      currency: 'BRL',
      description: 'Payed a PI that requested in another currency',
      status: 'succeeded',
      tolerance: 0.1,
      metadata: {
        cardId: 'card-1',
        someRandomProp: 'someRandomValue',
      },
      transactions: {
        create: [
          {
            id: 'transaction-4',
            amount: 0.00_030_000,
            confirmations: 6,
            originalAmount: 129.99,
          },
        ],
      },
      logs: {
        create: [
          {
            status: 'status_created',
          },
          {
            status: 'status_processing',
          },
          {
            status: 'status_succeeded',
          },
          {
            status: 'note',
            message: 'This is a note',
          },
        ],
      },
    },
  })

  const s7 = await prisma.paymentIntent.upsert({
    where: {id: 'seed-7'},
    update: {},
    create: {
      id: 'seed-7',
      amount: 130000.99,
      address: createRandomAddress(),
      currency: 'USD',
      description: 'Canceled payment intent',
      status: 'canceled',
      cancellationReason: 'requested_by_customer',
      canceledAt: new Date(),
      tolerance: 1 / 100,
      metadata: {
        cardId: 'card-1',
        someRandomProp: 'someRandomValue',
      },
    },
  })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async e => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
