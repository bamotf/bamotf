import {describe, expect, test} from 'tests/base.fixture'

import {action, loader} from './api.payment-intents.$id._index'

describe('[GET] /api/payment-intents/:id', () => {
  test('should respond with a 200 status code', async ({
    faker,
    request: {authorize},
  }) => {
    // Create a fake payment intent
    const {id, amount} = await faker.db.paymentIntent()

    // Update the payment intent
    // const pi = await request.get(`/api/payment-intents/${id}`)
    const request = new Request(`http://app.com/api/payment-intents/${id}`, {
      method: 'GET',
      headers: await authorize(),
    })

    const pi = await loader({
      request,
      params: {
        id,
      },
      context: {},
    })

    // Check that the response is correct
    expect(pi.ok).toBeTruthy()
    expect(await pi.json()).toStrictEqual(
      expect.objectContaining({
        id,
        amount: amount.toString(),
      }),
    )
  })
})

describe('[POST] /api/payment-intents/:id', () => {
  test('should respond with a 200 status code', async ({
    faker,
    request: {authorize},
  }) => {
    // Create a fake payment intent
    const {id} = await faker.db.paymentIntent()

    // Update the payment intent
    // const pi = await request.post(`/api/payment-intents/${id}`, {
    //   data: {
    //     amount: 200,
    //   },
    // })

    let body = new URLSearchParams({
      amount: '200',
    })

    let request = new Request(`http://app.com/api/payment-intents/${id}`, {
      method: 'POST',
      body,
      headers: await authorize(),
    })

    const pi = await action({
      request,
      params: {
        id,
      },
      context: {},
    })

    // Check that the response is correct
    expect(pi.ok).toBeTruthy()
    expect(await pi.json()).toStrictEqual(
      expect.objectContaining({
        id: expect.any(String),
        amount: '200',
      }),
    )
  })
})
