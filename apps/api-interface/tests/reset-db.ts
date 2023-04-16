import {prisma} from 'db'
import {logger} from 'logger'

// This is a helper function that we can use to reset the database before each integration test.
export default async () => {
  logger.info('Resetting database...', process.env.DATABASE_URL)

  await prisma.$transaction([
    prisma.paymentIntent.deleteMany(),
    // prisma.user.deleteMany(),
  ])
}
