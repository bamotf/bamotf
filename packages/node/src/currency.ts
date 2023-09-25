import {currency as currencyUtil} from '@bamotf/utils'
import type {AxiosInstance} from 'axios'

import type {CurrencyCode, FiatCurrencyCode} from '../../../config/currency'

export class Currency {
  private client: AxiosInstance

  constructor(client: AxiosInstance) {
    this.client = client
  }

  /**
   * Get the current price of 1 BTC in a given fiat currency.
   *
   * @param currency - Fiat currency code.
   * @returns The current price of the fiat currency.
   */
  async getBitcoinPrice<T extends FiatCurrencyCode>(currency: T) {
    const request = await this.client.get<{
      price: number
      currency: T
    }>(`/api/price/${currency}`)

    return request.data
  }

  /**
   * Convert a given amount of fiat currency to Bitcoins.
   *
   * @example
   * ```js
   * // Convert $12.34 USD to BTC 0.0000...
   * const amount = await bamotf.currency.toBitcoin({
   *  amount: 1234n,
   *  currency: 'USD',
   * })
   * ```
   */
  async toBitcoin(ops: {amount: bigint; currency: CurrencyCode}) {
    const {amount, currency} = ops

    if (currency === 'BTC') {
      return currencyUtil.fractionate(ops)
    }

    const {price: fractionatedPrice} = await this.getBitcoinPrice(currency)
    const price = currencyUtil.removeFraction({
      amount: fractionatedPrice,
      currency,
    })

    const ratio = Number(amount) / Number(price)
    return Math.ceil(ratio * 1e8) / 1e8
  }
}
