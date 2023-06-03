import {expect, test} from 'tests/base.fixture'

test.describe('[POST] /api/payment-intents/:id/cancel', () => {
  test('should respond with a 200 status code', async ({request, faker}) => {
    // Create a fake payment intent
    const {id} = await faker.createFakePaymentIntent()

    // Cancel the payment intent
    const pi = await request.post(`/api/payment-intents/${id}/cancel`)

    // Check that the response is correct
    expect(pi.ok()).toBeTruthy()
    expect(await pi.json()).toStrictEqual(
      expect.objectContaining({
        status: 'canceled',
      }),
    )
  })
})
