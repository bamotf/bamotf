// This file setup the mock request server for all tests.
//
// It might not be very performant to mock all external requests for each test
// so we might want to mock only the handles that we need for the specific test,
// which is a good practice for integration testing since we can isolate the test to a
// specific response and see if the code is working as expected.

// Highly recommended to read the docs:
// https://mswjs.io/docs/recipes

import {beforeAll, afterAll, afterEach} from 'vitest'
import {setupServer} from 'msw/node'
import {handlers} from '~/mocks/handlers'

// This configures a request mocking server with the given request handlers.
export const server = setupServer(...handlers)

// Start server before all tests
beforeAll(() => server.listen({onUnhandledRequest: 'error'}))

//  Close server after all tests
afterAll(() => server.close())

// Reset handlers after each test `important for test isolation`
afterEach(() => server.resetHandlers())
