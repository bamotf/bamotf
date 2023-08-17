import {faker} from '@faker-js/faker'

import {prisma, type Mode} from '~/utils/prisma.server'
import type {CurrencyCode} from '../../../../config/currency'
import {createRandomAddress} from './bitcoin'

/**
 * Create a fake user in the database
 */
export function user() {
  return prisma.user.create({
    data: {
      username: faker.internet.userName(),
    },
  })
}

/**
 * Create a fake account and owner in the database
 */
export async function account(props?: {
  ownerId?: string
  name?: string
  mode?: Mode
}) {
  const {
    name = faker.company.name(),
    ownerId = (await user()).id,
    mode = 'DEV',
  } = props || {}

  return prisma.account.create({
    data: {
      name,
      ownerId: ownerId,
      apis: {
        create: {
          mode,
          key: faker.string.alphanumeric(32),
          name: 'default',
        },
      },
      webhooks: {
        create: {
          mode,
          url: faker.internet.url(),
          secret: faker.string.alphanumeric(32),
        },
      },
    },
    include: {
      apis: true,
      webhooks: true,
    },
  })
}

/**
 * Create a fake payment intent in the database
 */
export async function paymentIntent(props?: {
  accountId?: string
  amount?: number
  address?: string
  currency?: CurrencyCode
  mode?: Mode
}) {
  const {
    amount = 100,
    address = createRandomAddress(),
    accountId = (await account({mode: props?.mode})).id,
    mode = 'DEV',
    ...rest
  } = props || {}

  return prisma.paymentIntent.create({
    data: {
      mode,
      amount: amount,
      address,
      accountId,
      ...rest,
    },
  })
}
