import {rest, type MockedRequest, type RestHandler} from 'msw'

import {env} from '../app/utils/env.server'
import {logMockedData, skip} from './utils'

const btcServers: Array<RestHandler<MockedRequest>> = []

if (!env.TESTNET_BITCOIN_CORE_URL) {
  // HACK: we need to skip the Bitcoin Core API connection during integration tests
  // but, for now, theres not way to mock the connection string, so this makes the
  // env variable required for the tests to pass.
  throw new Error('TESTNET_BITCOIN_CORE_URL is not defined during tests')
}

// 🍚 Skip the Bitcoin Core API
btcServers.push(rest.post(env.TESTNET_BITCOIN_CORE_URL.origin, skip))
btcServers.push(
  rest.post(`${env.TESTNET_BITCOIN_CORE_URL.origin}/wallet/:wallet_name`, skip),
)

export const handlers = [
  ...btcServers,

  // 💰 Mock the Price Endpoint
  rest.get(
    'https://price.bisq.wiz.biz/getAllMarketPrices',
    async (req, res, ctx) => {
      return res(
        ctx.json({
          coinoneTs: 1690839591000,
          coinoneCount: 1,
          bitstampTs: 1690839590000,
          bitstampCount: 5,
          bitfinexTs: 1690839592166,
          bitfinexCount: 12,
          coingeckoTs: 1690839591445,
          coingeckoCount: 45,
          coinbaseproTs: 1690839591768,
          coinbaseproCount: 10,
          lunoTs: 1690839592773,
          lunoCount: 4,
          coinmarketcapTs: 0,
          coinmarketcapCount: 1,
          bitflyerTs: 1690839591407,
          bitflyerCount: 2,
          independentreserveTs: 1690841010513,
          independentreserveCount: 3,
          paribuTs: 1690839591740,
          paribuCount: 1,
          btcAverageTs: 0,
          btcAverageCount: 1,
          poloniexTs: 1690839592084,
          poloniexCount: 8,
          binanceTs: 0,
          binanceCount: 0,
          mercadobitcoinTs: 1690839591000,
          mercadobitcoinCount: 1,
          krakenTs: 1690839591581,
          krakenCount: 15,
          btcmarketsTs: 1690839529000,
          btcmarketsCount: 3,
          data: [
            {
              currencyCode: 'AED',
              price: 53706.031,
              timestampSec: 1690839600012,
              provider: 'Bisq-Aggregate',
            },
            {
              currencyCode: 'AUD',
              price: 43561.17975,
              timestampSec: 1690839600012,
              provider: 'Bisq-Aggregate',
            },
            {
              currencyCode: 'BDT',
              price: 3175345.881,
              timestampSec: 1690839591445,
              provider: 'COINGECKO',
            },
            {
              currencyCode: 'BHD',
              price: 11021.867,
              timestampSec: 1690839591445,
              provider: 'COINGECKO',
            },
            {
              currencyCode: 'BMD',
              price: 29243.169,
              timestampSec: 1690839591445,
              provider: 'COINGECKO',
            },
            {
              currencyCode: 'BRL',
              price: 138734.61888123,
              timestampSec: 1690839600012,
              provider: 'Bisq-Aggregate',
            },
            {
              currencyCode: 'CAD',
              price: 38529.252,
              timestampSec: 1690839600012,
              provider: 'Bisq-Aggregate',
            },
            {
              currencyCode: 'CHF',
              price: 25519.3475,
              timestampSec: 1690839600012,
              provider: 'Bisq-Aggregate',
            },
            {
              currencyCode: 'CLP',
              price: 2.4585609955e7,
              timestampSec: 1690839591445,
              provider: 'COINGECKO',
            },
            {
              currencyCode: 'CNY',
              price: 208889.808,
              timestampSec: 1690839591445,
              provider: 'COINGECKO',
            },
            {
              currencyCode: 'CZK',
              price: 634687.903,
              timestampSec: 1690839591445,
              provider: 'COINGECKO',
            },
            {
              currencyCode: 'DAI',
              price: 3.426e-5,
              timestampSec: 1690839592166,
              provider: 'BITFINEX',
            },
            {
              currencyCode: 'DASH',
              price: 0.001078,
              timestampSec: 1690839600012,
              provider: 'Bisq-Aggregate',
            },
            {
              currencyCode: 'DCR',
              price: 5.08e-4,
              timestampSec: 1690839592084,
              provider: 'POLO',
            },
            {
              currencyCode: 'DKK',
              price: 198171.017,
              timestampSec: 1690839591445,
              provider: 'COINGECKO',
            },
            {
              currencyCode: 'DOGE',
              price: 2.64575e-6,
              timestampSec: 1690839600012,
              provider: 'Bisq-Aggregate',
            },
            {
              currencyCode: 'ETC',
              price: 6.321025e-4,
              timestampSec: 1690839600012,
              provider: 'Bisq-Aggregate',
            },
            {
              currencyCode: 'ETH',
              price: 0.06329897125,
              timestampSec: 1690839600012,
              provider: 'Bisq-Aggregate',
            },
            {
              currencyCode: 'EUR',
              price: 26570.259,
              timestampSec: 1690839600012,
              provider: 'Bisq-Aggregate',
            },
            {
              currencyCode: 'GBP',
              price: 22780.0288,
              timestampSec: 1690839600012,
              provider: 'Bisq-Aggregate',
            },
            {
              currencyCode: 'HKD',
              price: 228059.232,
              timestampSec: 1690839591445,
              provider: 'COINGECKO',
            },
            {
              currencyCode: 'HUF',
              price: 1.0299151892e7,
              timestampSec: 1690839591445,
              provider: 'COINGECKO',
            },
            {
              currencyCode: 'IDR',
              price: 4.407280373175e8,
              timestampSec: 1690839600012,
              provider: 'Bisq-Aggregate',
            },
            {
              currencyCode: 'ILS',
              price: 107162.121,
              timestampSec: 1690839591445,
              provider: 'COINGECKO',
            },
            {
              currencyCode: 'INR',
              price: 2405132.116,
              timestampSec: 1690839591445,
              provider: 'COINGECKO',
            },
            {
              currencyCode: 'JPY',
              price: 4158314.278,
              timestampSec: 1690839600012,
              provider: 'Bisq-Aggregate',
            },
            {
              currencyCode: 'KRW',
              price: 3.7691489241e7,
              timestampSec: 1690839600012,
              provider: 'Bisq-Aggregate',
            },
            {
              currencyCode: 'KWD',
              price: 8979.963,
              timestampSec: 1690839591445,
              provider: 'COINGECKO',
            },
            {
              currencyCode: 'LKR',
              price: 9364130.963,
              timestampSec: 1690839591445,
              provider: 'COINGECKO',
            },
            {
              currencyCode: 'LTC',
              price: 0.0029909557142857143,
              timestampSec: 1690839600012,
              provider: 'Bisq-Aggregate',
            },
            {
              currencyCode: 'MMK',
              price: 6.1447360611e7,
              timestampSec: 1690839591445,
              provider: 'COINGECKO',
            },
            {
              currencyCode: 'MXN',
              price: 489606.69,
              timestampSec: 1690839591445,
              provider: 'COINGECKO',
            },
            {
              currencyCode: 'MYR',
              price: 132743.5895,
              timestampSec: 1690839600012,
              provider: 'Bisq-Aggregate',
            },
            {
              currencyCode: 'NGN',
              price: 2.3783773072e7,
              timestampSec: 1690839600012,
              provider: 'Bisq-Aggregate',
            },
            {
              currencyCode: 'NOK',
              price: 295994.391,
              timestampSec: 1690839591445,
              provider: 'COINGECKO',
            },
            {
              currencyCode: 'NON_EXISTING_SYMBOL',
              price: 0.0,
              timestampSec: 0,
              provider: 'CMC',
            },
            {
              currencyCode: 'NON_EXISTING_SYMBOL_BA',
              price: 0.0,
              timestampSec: 0,
              provider: 'BA',
            },
            {
              currencyCode: 'NZD',
              price: 47050.802500000005,
              timestampSec: 1690839600012,
              provider: 'Bisq-Aggregate',
            },
            {
              currencyCode: 'PHP',
              price: 1600595.701,
              timestampSec: 1690839591445,
              provider: 'COINGECKO',
            },
            {
              currencyCode: 'PKR',
              price: 8383120.442,
              timestampSec: 1690839591445,
              provider: 'COINGECKO',
            },
            {
              currencyCode: 'PLN',
              price: 117096.991,
              timestampSec: 1690839591445,
              provider: 'COINGECKO',
            },
            {
              currencyCode: 'RUB',
              price: 2682859.586,
              timestampSec: 1690839591445,
              provider: 'COINGECKO',
            },
            {
              currencyCode: 'SAR',
              price: 109712.593,
              timestampSec: 1690839591445,
              provider: 'COINGECKO',
            },
            {
              currencyCode: 'SEK',
              price: 307904.256,
              timestampSec: 1690839591445,
              provider: 'COINGECKO',
            },
            {
              currencyCode: 'SGD',
              price: 38872.945,
              timestampSec: 1690839591445,
              provider: 'COINGECKO',
            },
            {
              currencyCode: 'THB',
              price: 1001107.216,
              timestampSec: 1690839591445,
              provider: 'COINGECKO',
            },
            {
              currencyCode: 'TRY',
              price: 815903.6943333334,
              timestampSec: 1690839600012,
              provider: 'Bisq-Aggregate',
            },
            {
              currencyCode: 'TWD',
              price: 918662.474,
              timestampSec: 1690839591445,
              provider: 'COINGECKO',
            },
            {
              currencyCode: 'UAH',
              price: 1080650.801,
              timestampSec: 1690839591445,
              provider: 'COINGECKO',
            },
            {
              currencyCode: 'USD',
              price: 29238.83483333333,
              timestampSec: 1690839600012,
              provider: 'Bisq-Aggregate',
            },
            {
              currencyCode: 'VND',
              price: 6.92708771461e8,
              timestampSec: 1690839591445,
              provider: 'COINGECKO',
            },
            {
              currencyCode: 'XMR',
              price: 0.005498633333333333,
              timestampSec: 1690839600012,
              provider: 'Bisq-Aggregate',
            },
            {
              currencyCode: 'ZAR',
              price: 529995.034,
              timestampSec: 1690839600012,
              provider: 'Bisq-Aggregate',
            },
            {
              currencyCode: 'ZEC',
              price: 0.001030925,
              timestampSec: 1690839600012,
              provider: 'Bisq-Aggregate',
            },
            {
              currencyCode: 'ZEN',
              price: 3.093e-4,
              timestampSec: 1690839591768,
              provider: 'COINBASEPRO',
            },
          ],
          bitcoinFeesTs: 1690839600,
          bitcoinFeeInfo: {
            btcTxFee: 11,
            btcMinTxFee: 8,
          },
        }),
      )
    },
  ),
] satisfies Array<RestHandler<MockedRequest>>
