import {logger} from 'logger'
import {setupServer} from 'msw/node'

import {handlers} from './handlers'

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

// This configures a request mocking server with the given request handlers.
export const server = setupServer(...handlers)

logger.info('🔶 Mock server installed')
