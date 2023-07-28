/* eslint-disable turbo/no-undeclared-env-vars */
/* eslint-disable import/no-anonymous-default-export */
import {logger} from 'logger'

import {getPasswordHash} from '~/utils/auth.server'
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
    prisma.user.update({
      where: {username: 'satoshi'},
      data: {
        password: {
          update: {
            hash: await getPasswordHash('satoshi'),
          },
        },
      },
    }),
  ])
}
