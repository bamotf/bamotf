import {logger} from 'logger'
import {beforeEach} from 'vitest'

import resetBitcoinCore from './reset-btc-core'
import resetDb from './reset-db'
import resetQueues from './reset-queues'

beforeEach(async () => {
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
