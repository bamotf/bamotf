const {PrismaClient} = require('.prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding...')

  console.time(`👑 Created admin role/permission...`)
  const adminRole = await prisma.role.upsert({
    where: {name: 'admin'},
    update: {},
    create: {
      name: 'admin',
      permissions: {
        create: {name: 'admin'},
      },
    },
  })
  console.timeEnd(`👑 Created admin role/permission...`)
  console.time(`👾 Created "satoshi" user with no password and admin role`)
  await prisma.user.upsert({
    where: {username: 'satoshi'},
    update: {},
    create: {
      name: 'Satoshi Nakamoto',
      username: 'satoshi',
      roles: {connect: {id: adminRole.id}},
      password: {
        create: {
          hash: '$2a$10$pbhQQBL4wbSk1zuf/K7Wl.fqdCZHizmZtgmx/veQHRprfUp529cTa', // empty string
        },
      },
    },
  })
  console.timeEnd(`👾 Created "satoshi" user with no password and admin role`)

  // eslint-disable-next-line turbo/no-undeclared-env-vars
  if (process.env.NODE_ENV === 'production') {
    return
  }

  console.time(`🦺 Created example payment intents`)

  // Create a test payment intents
  prisma.$transaction([
    prisma.paymentIntent.upsert({
      where: {id: 'seed-1'},
      update: {},
      create: {
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
        id: 'seed-2',
        amount: 420.69,
        address: 'random-address-2',
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
    }),

    prisma.paymentIntent.upsert({
      where: {id: 'seed-3'},
      update: {},
      create: {
        id: 'seed-3',
        amount: 0.10_002_001,
        address: 'random-address-3',
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
    }),

    prisma.paymentIntent.upsert({
      where: {id: 'seed-4'},
      update: {},
      create: {
        id: 'seed-4',
        amount: 10,
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
        id: 'seed-5',
        amount: 10_000,
        address: 'random-address-5',
        currency: 'USD',
        description: 'Requested in another currency',
      },
    }),

    prisma.paymentIntent.upsert({
      where: {id: 'seed-6'},
      update: {},
      create: {
        id: 'seed-6',
        amount: 130.99,
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
    }),

    prisma.paymentIntent.upsert({
      where: {id: 'seed-7'},
      update: {},
      create: {
        id: 'seed-7',
        amount: 130000.99,
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
