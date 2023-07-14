import {test as base} from '@playwright/test'
import {logger} from 'logger'

import * as bitcoinCore from '~/utils/bitcoin-core'
import faker from './faker'
import resetBitcoinCore from './reset-btc-core'
import resetDb from './reset-db'
import resetQueues from './reset-queues'

export type Options = {
  bitcoinCore: typeof bitcoinCore
  faker: typeof faker
  headers: {
    Authorization: string
  }
}

export const test = base.extend<Options>({
  bitcoinCore,
  faker,
  headers: {
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    Authorization: `Bearer ${process.env.API_KEY}`,
  },
})

test.beforeEach(async () => {
  logger.debug('Resetting all services...')

  await resetDb()
  await resetQueues()
  await resetBitcoinCore()
})

// HACK: Depending on the tools we need we might need to replicate this thing
// @ts-expect-error - Playwright doesn't know how to serialize BigInts
BigInt.prototype.toJSON = function () {
  if (
    (this as bigint) >= BigInt(Number.MIN_SAFE_INTEGER) &&
    (this as bigint) <= BigInt(Number.MAX_SAFE_INTEGER)
  ) {
    return Number(this)
  }

  throw new TypeError('Do not know how to serialize a BigInt')
}

export const expect = test.expect
