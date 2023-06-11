/**
 * This is basically a wrapper for the ts-rest client with a easier to understand API.
 */

import {initClient} from '@ts-rest/core'

export type {PaymentIntent} from '@prisma/client'

// type APIClient = InitClientReturn<
//   typeof contract,
//   {
//     baseUrl: string
//     baseHeaders: {}
//   }
// >
type APIClient = any

type ObjectsFromAPI = keyof APIClient
type MethodsFromObject<T extends ObjectsFromAPI> = keyof APIClient[T]

type Params<
  TObject extends ObjectsFromAPI,
  TMethod extends MethodsFromObject<TObject>,
> = APIClient[TObject][TMethod]

export type BamOtfConfig = {
  /**
   * Hostname of the *bam-otf* server.
   * @default 'localhost'
   */
  host?: string
  /**
   * Port of the *bam-otf* server.
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
    // @ts-expect-error
    params: Parameters<Params<'paymentIntents', 'create'>>['0']['body'],
  ) {
    return this.client.paymentIntents.create({
      body: params,
    })
  }

  async retrieve(id: string) {
    return this.client.paymentIntents.retrieve({
      params: {id: 'id'},
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
 * bam-otf client class.
 * @param apiKey - API key.
 * @param config - Client configuration.
 */
export class BamOtf {
  public paymentIntents: PaymentIntents
  private config: BamOtfConfig
  private client: APIClient

  constructor(apiKey: string, config?: BamOtfConfig) {
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
      throw new Error('bam-otf API key is required.')
    }

    // @ts-expect-error
    this.client = initClient(contract, {
      baseUrl: `http://${host}:${port}/api`,
      baseHeaders: {
        Authorization: `Bearer ${apiKey}`,
      },
    })

    this.paymentIntents = new PaymentIntents(this.client)
  }
}

export default BamOtf
