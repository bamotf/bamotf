import {prisma} from '~/utils/prisma.server'

export function getAccountByUser(userId: string) {
  return prisma.account.findFirstOrThrow({
    where: {
      ownerId: userId,
    },
  })
}
