import {PrismaClient} from '@prisma/client'
import {createRandomAddress} from '../tests/faker/bitcoin'
const prisma = new PrismaClient()

async function main() {
  const s1 = await prisma.paymentIntent.upsert({
    where: {id: 'seed-1'},
    update: {},
    create: {
      id: 'seed-1',
      amount: 100,
      description: 'User has not paid',
      address: createRandomAddress(),
    },
  })

  const s2 = await prisma.paymentIntent.upsert({
    where: {id: 'seed-2'},
    update: {},
    create: {
      id: 'seed-2',
      amount: 420.69 * 1e8,
      address: createRandomAddress(),
      status: 'succeeded',
      description: 'User has paid',
      transactions: {
        create: [
          {
            id: 'transaction-1',
            amount: 420.69 * 1e8,
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
      amount: 10_000_000,
      address: createRandomAddress(),
      status: 'pending',
      confirmations: 6,
      description: 'Not enough confirmations',
      transactions: {
        create: [
          {
            id: 'transaction-2',
            amount: 10_000_000,
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
      amount: 10_00_000_000,
      address: createRandomAddress(),
      description: "User has paid but we haven't received enough funds",
      transactions: {
        create: [
          {
            id: 'transaction-3',
            amount: 10_000_000,
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
      amount: 10000_00,
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
      amount: 130_99,
      address: createRandomAddress(),
      currency: 'BRL',
      description: 'Payed a PI that requested in another currency',
      status: 'succeeded',
      transactions: {
        create: [
          {
            id: 'transaction-4',
            amount: 30_000,
            confirmations: 6,
            originalAmount: 130_99,
          },
        ],
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
