import {env} from './env.server'

type CurrencyData = {
  currencyCode: string
  price: number
  timestampSec: number
  provider: string
}

type BitcoinFeeInfo = {
  btcTxFee: number
  btcMinTxFee: number
}

type DataObject = {
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
export const getBitcoinPrice = async (currencyCode: string) => {
  const result = await getData()
  const priceData = result.data.find(d => d.currencyCode === currencyCode)
  if (!priceData) {
    throw new Error(`No price data for ${currencyCode}`)
  }
  return priceData.price
}

function getData(): Promise<DataObject> {
  // TODO: Use the tor url
  return fetch(env.PRICE_DATA_SERVER_CLEARNET_URL).then(res => res.json())
}
