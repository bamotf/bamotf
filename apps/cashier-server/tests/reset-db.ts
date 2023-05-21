/* eslint-disable turbo/no-undeclared-env-vars */
/* eslint-disable import/no-anonymous-default-export */
import {prisma} from 'db'
import {logger} from 'logger'

// This is a helper function that we can use to reset the database before each integration test.
export default async () => {
  logger.debug('Resetting database...', process.env.DATABASE_CONNECTION_STRING)

  await prisma.$transaction([
    prisma.paymentIntent.deleteMany(),
    // prisma.user.deleteMany(),
  ])
}
