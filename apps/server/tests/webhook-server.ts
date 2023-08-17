import http from 'http'
import {format, logger} from 'logger'

import {env} from '~/utils/env.server'
import {vi} from './base.fixture'

export class WebhookTestServer {
  /**
   * Create a simple http server that emits a `webhook` event when a request is received.
   * Good for testing if webhooks are called.
   */
  readonly server: http.Server
  readonly port?: number

  constructor() {
    this.server = http.createServer()
  }

  /**
   * Start the server and set the environment variables.
   * @param next Function to be called after the server is listening.
   */
  public async listen() {
    return new Promise<void>(resolve => {
      logger.info('listening fake webserver...')

      this.server.listen(0, async () => {
        // @ts-expect-error
        this.port = this.server.address().port

        vi.spyOn(env, 'DEV_WEBHOOK_URL', 'get').mockReturnValue(
          `http://localhost:${this.port}`,
        )

        vi.spyOn(env, 'DEV_WEBHOOK_SECRET', 'get').mockReturnValue('secret')

        logger.info(`[${format.yellow(this.port)}] fake webserver started`)
        await resolve()
      })
    })
  }

  /**
   * Wait for the server to receive a request.
   * @returns A promise that resolves when the server receives a request.
   */
  public onServerCalled() {
    return new Promise(resolve => {
      logger.info(`[${format.yellow(this.port)}] waiting request`)
      this.server.on('request', (req, res) => {
        let body = ''
        logger.silly(`[${format.yellow(this.port)}] request`)

        req.on('data', chunk => {
          logger.silly(`[${format.yellow(this.port)}] data`)

          body += chunk
        })
        req.on('end', () => {
          logger.info(`[${format.yellow(this.port)}] finished request`)
          const payload = JSON.parse(body)
          res.writeHead(200, {'Content-Type': 'text/plain'})
          res.end('OK')

          resolve(payload)
        })
      })
    })
  }
}
