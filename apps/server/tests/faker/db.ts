import {faker} from '@faker-js/faker'

import {prisma, type AccessMode, type Mode} from '~/utils/prisma.server'
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
export async function account(props?: {ownerId?: string; name?: string}) {
  const {name = faker.company.name(), ownerId = (await user()).id} = props || {}

  return prisma.account.create({
    data: {
      name,
      ownerId: ownerId,
    },
  })
}

/**
 * Create a fake webhook in the database
 * @param props
 * @returns
 */
export async function webhook(props?: {
  url?: string
  /**
   * @default 'test'
   */
  mode?: AccessMode
  secret?: string
  accountId?: string
}) {
  const {
    url = faker.internet.url(),
    mode = 'test',
    secret = faker.string.alphanumeric(32),
    accountId = (await account()).id,
    ...rest
  } = props || {}

  return prisma.webhook.create({
    data: {
      url,
      mode,
      secret,
      accountId,
      ...rest,
    },
  })
}

/**
 * Create a fake api in the database
 * @param props
 * @returns
 */
export async function api(props?: {
  /**
   * @default 'test'
   */
  mode?: AccessMode
  name?: string
  key?: string
  accountId?: string
}) {
  const {
    mode = 'test',
    name = faker.internet.displayName(),
    key = faker.string.alphanumeric(32),
    accountId = (await account()).id,
    ...rest
  } = props || {}

  return prisma.api.create({
    data: {
      mode,
      name,
      key,
      accountId,
      ...rest,
    },
  })
}

/**
 * Create a fake payment intent in the database
 */
export async function paymentIntent(props?: {
  mode?: Mode
  accountId?: string
  amount?: number
  address?: string
  currency?: CurrencyCode
}) {
  const {
    amount = 100,
    address = createRandomAddress(),
    accountId = (await account()).id,
    mode = 'dev',
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
