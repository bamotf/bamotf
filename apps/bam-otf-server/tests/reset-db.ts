/* eslint-disable turbo/no-undeclared-env-vars */
/* eslint-disable import/no-anonymous-default-export */
import {PrismaClient} from '@prisma/client'
import {logger} from 'logger'

const prisma = new PrismaClient()

// This is a helper function that we can use to reset the database before each integration test.
export default async () => {
  logger.debug('Resetting database...')

  await prisma.$transaction([
    prisma.log.deleteMany(),
    prisma.webhookAttempt.deleteMany(),
    prisma.transaction.deleteMany(),
    prisma.paymentIntent.deleteMany(),
    // prisma.user.deleteMany(),
  ])
}
