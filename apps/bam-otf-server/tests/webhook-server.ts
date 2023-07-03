import http from 'http'
import {ConnectionString} from 'connection-string'

import {env} from '../../../env/env'

export class WebhookTestServer {
  /**
   * Create a simple http server that emits a `webhook` event when a request is received.
   * Good for testing if webhooks are called.
   */
  readonly server: http.Server

  constructor() {
    this.server = http.createServer()
  }

  /**
   * Start the server and set the environment variables.
   * @param next Function to be called after the server is listening.
   */
  public async listen() {
    const webhookConnectionString = new ConnectionString(env.WEBHOOK_URL)

    return new Promise<void>(resolve => {
      this.server.listen(webhookConnectionString.port, async () => {
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
      this.server.on('request', (req, res) => {
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
}
