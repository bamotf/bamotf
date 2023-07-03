import {rest} from 'msw'
import {describe, expect, test} from 'vitest'

import {env} from '../../../../env/env'
import {server} from '../../tests/setup.unit'
import {
  getBtcAmountFromFiat,
  getCurrencyValueFromSatoshis,
  type PriceAPIDataObject,
} from './price'

describe('getPriceInSatoshis', () => {
  test.each([
    {amount: 1, btcPrice: 10, expected: 0.10_000_000},
    {amount: 10, btcPrice: 1, expected: 10},
    {amount: 12, btcPrice: 134_858.928272, expected: 0.00_008_898},
    {amount: 2, btcPrice: 300_134_858.92, expected: 0.00_000_001},
  ])('(%i, %i) -> %i', async ({amount, btcPrice, expected}) => {
    const currencyCode = 'USD'

    server.use(
      rest.get(env.PRICE_DATA_SERVER_CLEARNET_URL, (req, res, ctx) => {
        const returnData = {
          data: [
            {
              currencyCode,
              price: btcPrice,
              provider: 'coinmarketcap',
              timestampSec: 1625241600,
            },
          ] satisfies PriceAPIDataObject['data'],
        }

        return res(ctx.json(returnData))
      }),
    )

    const satoshis = await getBtcAmountFromFiat({
      currency: currencyCode,
      amount,
    })

    expect(satoshis).toBe(expected)
  })
})

describe('getCurrencyValueFromSatoshis', () => {
  test.each([
    {amount: 0.10_000_000, btcPrice: 10, expected: 1},
    {amount: 10, btcPrice: 1, expected: 10},
    {amount: 0.00_008_898, btcPrice: 134_823.7398, expected: 12},
    {amount: 0.00002, btcPrice: 293_801.32123, expected: 5.88},
  ])(
    'should calculate the price in satoshis correctly (%i, %i) -> %i',
    async ({amount, btcPrice, expected}) => {
      const currencyCode = 'USD'

      server.use(
        rest.get(env.PRICE_DATA_SERVER_CLEARNET_URL, (req, res, ctx) => {
          const returnData = {
            data: [
              {
                currencyCode,
                price: btcPrice,
                provider: 'coinmarketcap',
                timestampSec: 1625241600,
              },
            ] satisfies PriceAPIDataObject['data'],
          }

          return res(ctx.json(returnData))
        }),
      )

      const satoshis = await getCurrencyValueFromSatoshis({
        currency: currencyCode,
        amount,
      })

      expect(satoshis).toBe(expected)
    },
  )
})
