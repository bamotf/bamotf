import axios, {type AxiosInstance} from 'axios'

import * as address from './address'
import type {BamotfConfig} from './config'
import {UnauthorizedError} from './errors'
import {parse} from './parse'
import {PaymentIntents} from './payment-intents'
import * as webhooks from './webhooks'

/**
 * *bamotf* client class.
 * @param apiKey - API key.
 * @param config - Client configuration.
 */

export class Bamotf {
  public paymentIntents: PaymentIntents
  private config: BamotfConfig
  private client: AxiosInstance
  public webhooks = webhooks
  public address = address

  constructor(apiKey: string, config?: BamotfConfig) {
    const {
      baseURL = process.env.PUBLISHING === 'true'
        ? 'http://localhost:21000'
        : 'http://localhost:3000',
      // maxNetworkRetries = 3,
      timeout = 60000,
    } = config || {}

    this.config = {
      baseURL,
      timeout,
    }

    if (!apiKey) {
      throw new UnauthorizedError('bamotf API key is required.')
    }

    this.client = axios.create({
      baseURL: `${baseURL}/api`,
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      timeout,
    })

    this.client.interceptors.response.use(
      response => {
        // Parse the __meta__ fields from the response
        response.data = parse(response.data)
        return response
      },
      error => {
        if (error.response?.status === 401) {
          throw new UnauthorizedError('bamotf API key is invalid.')
        }

        return Promise.reject(error)
      },
    )

    this.paymentIntents = new PaymentIntents(this.client)
  }
}
