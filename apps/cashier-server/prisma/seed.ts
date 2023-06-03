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
