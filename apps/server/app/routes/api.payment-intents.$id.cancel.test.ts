import {describe, expect, test} from 'tests/base.fixture'

import {action} from './api.payment-intents.$id.cancel'

describe('[POST] /api/payment-intents/:id/cancel', () => {
  test('should respond with a 200 status code', async ({
    faker,
    request: {authorize},
  }) => {
    // Create a fake payment intent
    const {id} = await faker.db.paymentIntent()

    // Cancel the payment intent
    // const pi = await request.post(`/api/payment-intents/${id}/cancel`)

    let request = new Request(`http://app.com/api/payment-intents`, {
      method: 'POST',
      headers: await authorize(),
    })

    const pi = await action({
      request,
      params: {id},
      context: {},
    })

    // Check that the response is correct
    expect(pi.ok).toBeTruthy()
    expect(await pi.json()).toStrictEqual(
      expect.objectContaining({
        status: 'canceled',
        canceledAt: expect.any(String),
      }),
    )
  })
})
