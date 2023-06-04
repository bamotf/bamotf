import type {FiatCurrencyCode} from '~/config/currency'
import {env} from './env.server'

type CurrencyData = {
  currencyCode: FiatCurrencyCode
  price: number
  timestampSec: number
  provider: string
}

type BitcoinFeeInfo = {
  btcTxFee: number
  btcMinTxFee: number
}

export type PriceAPIDataObject = {
  coinoneTs: number
  coinoneCount: number
  bitstampTs: number
  bitstampCount: number
  bitfinexTs: number
  bitfinexCount: number
  coingeckoTs: number
  coingeckoCount: number
  coinbaseproTs: number
  coinbaseproCount: number
  lunoTs: number
  lunoCount: number
  coinmarketcapTs: number
  coinmarketcapCount: number
  bitflyerTs: number
  bitflyerCount: number
  independentreserveTs: number
  independentreserveCount: number
  paribuTs: number
  paribuCount: number
  btcAverageTs: number
  btcAverageCount: number
  poloniexTs: number
  poloniexCount: number
  binanceTs: number
  binanceCount: number
  mercadobitcoinTs: number
  mercadobitcoinCount: number
  krakenTs: number
  krakenCount: number
  btcmarketsTs: number
  btcmarketsCount: number
  data: CurrencyData[]
  bitcoinFeesTs: number
  bitcoinFeeInfo: BitcoinFeeInfo
}

/**
 * Get the price of bitcoin in the given currency.
 * @param currencyCode The currency code to get the price in.
 * @returns The price of bitcoin in the given currency
 */
export const getBitcoinPrice = async (currencyCode: FiatCurrencyCode) => {
  const result = await getData()
  const priceData = result.data.find(d => d.currencyCode === currencyCode)
  if (!priceData) {
    throw new Error(`No price data for ${currencyCode}`)
  }
  return Math.round(priceData.price * 100) / 100
}

function getData(): Promise<PriceAPIDataObject> {
  // TODO: Use the tor url
  return fetch(env.PRICE_DATA_SERVER_CLEARNET_URL).then(res => res.json())
}

type FiatPrice = {
  currency: FiatCurrencyCode
  amount: number
}

/**
 * Get the total in BTC of the given amount in fiat.
 */
export const getBtcAmountFromFiat = async ({currency, amount}: FiatPrice) => {
  const price = await getBitcoinPrice(currency)
  return Math.round((amount / price) * 1e8) / 1e8
}

/**
 * Get the total in fiat of the given amount of BTCs.
 */
export const getCurrencyValueFromSatoshis = async ({
  currency,
  amount,
}: FiatPrice) => {
  const price = await getBitcoinPrice(currency)
  return Math.round(price * amount * 100) / 100
}
