import {setupServer} from 'msw/node'

import {handlers} from './handlers'

// This configures a request mocking server with the given request handlers.
export const server = setupServer(...handlers)

server.listen({
  onUnhandledRequest: 'warn',
  // onUnhandledRequest: 'error',
})
console.info('🔶 Mock server installed')

// @ts-ignore
process.once('SIGTERM', () => server.close())
// @ts-ignore
process.once('SIGINT', () => server.close())
