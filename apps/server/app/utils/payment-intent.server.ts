import {prisma, type Mode} from '~/utils/prisma.server'

export async function listPaymentIntents(accountId: string, mode: Mode) {
  return await Promise.all([
    prisma.paymentIntent.findMany({
      where: {
        accountId,
        mode,
      },
      orderBy: {createdAt: 'desc'},
    }),
    prisma.paymentIntent.count({
      where: {
        accountId,
        mode,
      },
    }),
  ])
}
