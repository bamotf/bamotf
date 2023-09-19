/* eslint-disable turbo/no-undeclared-env-vars */
/* eslint-disable import/no-anonymous-default-export */
import {logger} from 'logger'

import {PrismaClient} from '~/utils/prisma.server'

const prisma = new PrismaClient()

// This is a helper function that we can use to reset the database before each integration test.
export default async () => {
  logger.debug('Resetting database...')

  await prisma.$transaction([
    prisma.log.deleteMany(),
    prisma.webhookAttempt.deleteMany(),
    prisma.transaction.deleteMany(),
    prisma.paymentIntent.deleteMany(),
    prisma.webhook.deleteMany(),
    prisma.api.deleteMany(),
    prisma.account.deleteMany(),
    prisma.user.deleteMany(),
  ])
}
