import http from 'http'
import {vi} from 'vitest'
import {env} from '../api/utils/env'

/**
 * Create a simple http server that emits a `webhook` event when a request is received.
 * Good for testing if webhooks are called.
 */
export const server = http.createServer()

/**
 * Start the server and set the environment variables.
 * @param next Function to be called after the server is listening.
 */
export const listen = async (next: () => Promise<void>) => {
  server.listen(0, async () => {
    vi.spyOn(env, 'CASHIER_WEBHOOK_URL', 'get').mockReturnValue(
      `http://localhost:${
        // @ts-expect-error
        server.address().port
      }`,
    )

    vi.spyOn(env, 'CASHIER_SECRET', 'get').mockReturnValue('secret')

    await next()
  })
}

/**
 * Wait for the server to receive a request.
 * @returns A promise that resolves when the server receives a request.
 */
export const onServerCalled = () => {
  return new Promise(resolve => {
    server.on('request', (req, res) => {
      console.log('🔥🔥 ~ webhook trigger')
      let body = ''
      req.on('data', chunk => {
        body += chunk
      })
      req.on('end', () => {
        const payload = JSON.parse(body)
        res.writeHead(200, {'Content-Type': 'text/plain'})
        res.end('OK')

        resolve(payload)
      })
    })
  })
}
