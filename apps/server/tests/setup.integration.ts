// This file setup the mock request server for all tests.
//
// It might not be very performant to mock all external requests for each test
// so we might want to mock only the handles that we need for the specific test,
// which is a good practice for integration testing since we can isolate the test to a
// specific response and see if the code is working as expected.

// Highly recommended to read the docs:
// https://mswjs.io/docs/recipes

import {logger} from 'logger'
import {matchRequestUrl, type MockedRequest} from 'msw'
import {setupServer} from 'msw/node'
import {afterAll, afterEach, beforeAll, beforeEach} from 'vitest'

import {handlers} from '../mocks/handlers'
import resetBitcoinCore from './reset-btc-core'
import resetDb from './reset-db'
import resetQueues from './reset-queues'

// This configures a request mocking server with the given request handlers.
export const server = setupServer(...handlers)

// Start server before all tests
beforeAll(() => server.listen({onUnhandledRequest: 'error'}))

//  Close server after all tests
afterAll(() => server.close())

// Reset handlers after each test `important for test isolation`
afterEach(() => server.resetHandlers())

// Reset all services before each test
beforeEach(async () => {
  logger.debug('Resetting all services...')

  await Promise.all([resetDb(), resetQueues(), resetBitcoinCore()])
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

/**
 * This function is used to wait for a request to be made to the mock server.
 *
 * @note Request assertions should be avoided whenever possible. Always prefer testing the logic/UI dependent on the response to ensure request/response validity. Read more about [Request assertions](https://mswjs.io/docs/recipes/request-assertions).
 * @param method
 * @param url
 * @returns
 */
export function waitForRequest(method: string, url: string) {
  let requestId = ''

  return new Promise<MockedRequest>((resolve, reject) => {
    server.events.on('request:start', req => {
      const matchesMethod = req.method.toLowerCase() === method.toLowerCase()
      const matchesUrl = matchRequestUrl(req.url, url).matches

      if (matchesMethod && matchesUrl) {
        requestId = req.id
      }
    })

    server.events.on('request:match', req => {
      if (req.id === requestId) {
        resolve(req)
      }
    })

    server.events.on('request:unhandled', req => {
      if (req.id === requestId) {
        reject(
          new Error(`The ${req.method} ${req.url.href} request was unhandled.`),
        )
      }
    })
  })
}
