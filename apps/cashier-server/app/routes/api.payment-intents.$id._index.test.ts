import {expect, test} from 'tests/base.fixture'

test.describe('[GET] /api/payment-intents/:id', () => {
  test('should respond with a 200 status code', async ({request, faker}) => {
    // Create a fake payment intent
    const {id, amount} = await faker.paymentIntent.createFakePaymentIntent()

    // Update the payment intent
    const pi = await request.get(`/api/payment-intents/${id}`)

    // Check that the response is correct
    expect(pi.ok()).toBeTruthy()
    expect(await pi.json()).toStrictEqual(
      expect.objectContaining({
        id,
        amount: amount.toString(),
      }),
    )
  })
})

test.describe('[POST] /api/payment-intents/:id', () => {
  test('should respond with a 200 status code', async ({request, faker}) => {
    // Create a fake payment intent
    const {id} = await faker.paymentIntent.createFakePaymentIntent()

    // Update the payment intent
    const pi = await request.post(`/api/payment-intents/${id}`, {
      data: {
        amount: 200,
      },
    })

    // Check that the response is correct
    expect(pi.ok()).toBeTruthy()
    expect(await pi.json()).toStrictEqual(
      expect.objectContaining({
        id: expect.any(String),
        amount: '200',
      }),
    )
  })
})
