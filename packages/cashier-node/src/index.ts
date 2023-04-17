/**
 * This is basically a wrapper for the ts-rest client with a easier to understand API.
 */

import {initClient} from '@ts-rest/core'
import {contract} from 'api-interface/server/contract'
import type {InitClientReturn} from '@ts-rest/core'
import type {} from 'db'

type APIClient = InitClientReturn<
  typeof contract,
  {
    baseUrl: string
    baseHeaders: {}
  }
>

export type CashierConfig = {
  /**
   * Hostname of the Cashier server.
   * @default 'localhost'
   */
  host?: string
  /**
   * Port of the Cashier server.
   * @default 3000
   */
  port?: number
  /**
   * Maximum number of retries for network errors.
   * @default 3
   */
  // TODO: handle failed attempts
  // maxNetworkRetries?: number
  /**
   * Timeout for network requests.
   * @default 60000
   */
  // TODO: handle timeout
  // timeout?: number
  /**
   * Enable telemetry.
   * @default false
   */
  // TODO: handle telemetry
  // telemetry?: boolean
}

export class PaymentIntents {
  private client: APIClient

  constructor(client: APIClient) {
    this.client = client
  }

  async create(
    params: {
      amount: number
      description?: string
    } & ({account: string} | {address: string}),
  ) {
    return this.client.paymentIntents.create({
      body: params,
    })
  }

  async retrieve(id: string) {
    return this.client.paymentIntents.retrieve({
      params: {id},
    })
  }

  async list() {
    return this.client.paymentIntents.list()
  }

  async update(
    id: string,
    params: {amount?: number; address?: string; description?: string},
  ) {
    return this.client.paymentIntents.update({
      params: {id},
      body: params,
    })
  }

  async cancel(id: string, params?: {reason?: string}) {
    return this.client.paymentIntents.cancel({
      params: {id},
      body: {
        cancellationReason: params?.reason,
      },
    })
  }
}

/**
 * Cashier client class.
 * @param apiKey - API key.
 * @param config - Cashier client configuration.
 */
export class Cashier {
  public paymentIntents: PaymentIntents
  private config: CashierConfig
  private client: APIClient

  constructor(apiKey: string, config?: CashierConfig) {
    const {
      host = 'localhost',
      port = 3000,
      // maxNetworkRetries = 3,
      // telemetry = false,
      // timeout = 60000,
    } = config || {}

    this.config = {
      host,
      port,
      // maxNetworkRetries,
      // telemetry,
      // timeout
    }

    if (!apiKey) {
      throw new Error('Cashier API key is required.')
    }

    this.client = initClient(contract, {
      baseUrl: `http://${host}:${port}/api`,
      baseHeaders: {
        Authorization: `Bearer ${apiKey}`,
      },
    })

    this.paymentIntents = new PaymentIntents(this.client)
  }
}

export default Cashier
