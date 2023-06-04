import {expect, test} from 'tests/base.fixture'
import {FIAT_CURRENCY_CODES} from '~/config/currency'

test.describe('[GET] /api/price/:currency', () => {
  test('should respond with a 200 status code', async ({request, faker}) => {
    // select a random currency
    const currency = faker.helpers.arrayElement(FIAT_CURRENCY_CODES)

    // get the price
    const pi = await request.get(`/api/price/${currency}`)

    // Check that the response is correct
    expect(pi.ok()).toBeTruthy()
    expect(await pi.json()).toStrictEqual(
      expect.objectContaining({
        price: expect.any(Number),
      }),
    )
  })
})
