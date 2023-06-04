import {PrismaClient} from '@prisma/client'
import {createRandomAddress} from '../tests/faker/bitcoin'
const prisma = new PrismaClient()

async function main() {
  // Create a pending payment intent
  const s1 = await prisma.paymentIntent.upsert({
    where: {id: 'seed-1'},
    update: {},
    create: {
      id: 'seed-1',
      amount: 100,
      address: createRandomAddress(),
    },
  })

  // Create a succeeded payment intent
  const s2 = await prisma.paymentIntent.upsert({
    where: {id: 'seed-2'},
    update: {},
    create: {
      id: 'seed-2',
      amount: 420.69 * 1e8,
      address: createRandomAddress(),
      status: 'succeeded',
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

  // Create a pending payment intent with a transaction
  // that has less confirmations
  const s3 = await prisma.paymentIntent.upsert({
    where: {id: 'seed-3'},
    update: {},
    create: {
      id: 'seed-3',
      amount: 10_000_000,
      address: createRandomAddress(),
      status: 'pending',
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

  // User has paid but we haven't received enough funds
  const s4 = await prisma.paymentIntent.upsert({
    where: {id: 'seed-4'},
    update: {},
    create: {
      id: 'seed-4',
      amount: 10_00_000_000,
      address: createRandomAddress(),
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
