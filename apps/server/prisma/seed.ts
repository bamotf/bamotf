import {PrismaClient} from '@prisma/client'

import {createSecret} from '~/utils/encryption.server'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding...')

  const {id: accountId} = await prisma.account.findFirstOrThrow({
    where: {name: 'Initial Account'},
  })

  const {id: webhookId} = await prisma.webhook.create({
    data: {
      url: 'http://localhost:3000/webhook/bamotf',
      accountId,
      secret: createSecret(),
      mode: 'prod',
    },
  })

  console.time(`🦺 Created example payment intents`)
  // Create a test payment intents
  prisma.$transaction([
    prisma.paymentIntent.upsert({
      where: {id: 'seed-1'},
      update: {},
      create: {
        mode: 'dev',
        accountId,
        id: 'seed-1',
        amount: 1,
        description: 'User has not paid',
        address: 'random-address-1',
      },
    }),

    prisma.paymentIntent.upsert({
      where: {id: 'seed-2'},
      update: {},
      create: {
        mode: 'prod',
        accountId,
        id: 'seed-2',
        amount: 42069,
        address: 'random-address-2',
        status: 'succeeded',
        description: 'User has paid',
        transactions: {
          create: [
            {
              id: 'transaction-1',
              amount: 42069,
              confirmations: 6,
            },
          ],
        },
        webhookAttempts: {
          create: [
            {
              id: 'webhook-attempt-1',
              webhookId,
              status: 200,
              body: {
                userId: 1,
                id: 1,
                title: 'delectus aut autem',
                completed: false,
              },
              response: {
                userId: 1,
                id: 1,
                title: 'delectus aut autem',
                completed: false,
              },
              event: 'payment_intent.created',
              url: 'http://localhost:3000/webhook/bamotf',
            },
          ],
        },
      },
    }),

    prisma.paymentIntent.upsert({
      where: {id: 'seed-3'},
      update: {},
      create: {
        mode: 'dev',
        accountId,
        id: 'seed-3',
        amount: 10_002_001,
        address: 'random-address-3',
        confirmations: 6,
        description: 'Not enough confirmations',
        status: 'processing',
        transactions: {
          create: [
            {
              id: 'transaction-2',
              amount: 10_002_001,
              confirmations: 2,
            },
          ],
        },
      },
    }),

    prisma.paymentIntent.upsert({
      where: {id: 'seed-4'},
      update: {},
      create: {
        mode: 'dev',
        accountId,
        id: 'seed-4',
        amount: 1000,
        address: 'random-address-4',
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
    }),

    prisma.paymentIntent.upsert({
      where: {id: 'seed-5'},
      update: {},
      create: {
        mode: 'dev',
        accountId,
        id: 'seed-5',
        amount: 10_000_00,
        address: 'random-address-5',
        currency: 'USD',
        description: 'Requested in another currency',
      },
    }),

    prisma.paymentIntent.upsert({
      where: {id: 'seed-6'},
      update: {},
      create: {
        mode: 'dev',
        accountId,
        id: 'seed-6',
        amount: 13099,
        address: 'random-address-6',
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
              amount: 30_000,
              confirmations: 6,
              originalAmount: 12999,
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
    }),

    prisma.paymentIntent.upsert({
      where: {id: 'seed-7'},
      update: {},
      create: {
        mode: 'test',
        accountId,
        id: 'seed-7',
        amount: 13000099,
        address: 'random-address-7',
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
    }),
  ])
  console.timeEnd(`🦺 Created example payment intents`)
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
