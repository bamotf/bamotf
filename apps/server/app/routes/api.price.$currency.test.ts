import {describe, expect, test} from 'tests/base.fixture'

import {loader} from './api.price.$currency'

describe('[GET] /api/price/:currency', () => {
  test('should respond with a 200 status code', async ({request, faker}) => {
    // select a random currency
    const currency = faker.model.fiat()

    // get the price
    // const pi = await request.get(`/api/price/${currency}`)
    const pi = await loader({
      request: new Request(`http://app.com/api/price/${currency}`),
      params: {
        currency,
      },
      context: {},
    })

    // Check that the response is correct
    expect(pi.ok).toBeTruthy()
    expect(await pi.json()).toStrictEqual(
      expect.objectContaining({
        price: expect.any(Number),
      }),
    )
  })
})
