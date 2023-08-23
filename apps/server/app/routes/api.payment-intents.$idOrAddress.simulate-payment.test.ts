import {rest} from 'msw'
import {beforeEach} from 'node:test'
import {afterEach, describe, expect, test, vi} from 'tests/base.fixture'
import {server, waitForRequest} from 'tests/setup.integration'

import {env} from '~/utils/env.server'
import {action} from './api.payment-intents.$idOrAddress.simulate-payment'

afterEach(async () => {
  vi.restoreAllMocks()
  // HACK: this is a hack to make sure the test is finished and nothing else is running
  // await new Promise(resolve => setTimeout(resolve, 200))
})

describe('[POST] /api/payment-intents/:id/simulate-payment', () => {
  beforeEach(() => {
    // HACK: This is commented out because it's not working. I'm not sure why.
    // But after the bullmq job for the webhook kicks in, the env variables
    // go back to their original values.
    // vi.spyOn(env, 'DEV_MODE_ENABLED', 'get').mockReturnValue(true)
    // vi.spyOn(env, 'DEV_WEBHOOK_URL', 'get').mockReturnValue(
    //   'http://app.com/api/webhooks',
    // )

    if (!env.DEV_MODE_ENABLED) {
      throw new Error('DEV_MODE_ENABLED must be true during tests')
    }
  })

  test('should be able to simulate a successful payment', async ({
    faker,
    request: {authorize, parseFormData},
  }) => {
    // Create a fake payment intent
    const {id, accountId, amount, currency, confirmations} =
      await faker.db.paymentIntent()

    server.use(
      rest.post(env.DEV_WEBHOOK_URL!, async (req, res, ctx) => {
        return res(ctx.json({success: true}))
      }),
    )

    // const pi = await request.post(`/api/payment-intents/${id}/simulate-payment`)
    let request = new Request(
      `http://app.com/api/payment-intents/${id}/simulate-payment`,
      {
        method: 'POST',
        headers: await authorize({accountId}),
        body: parseFormData({
          amount,
          currency,
          confirmations,
        }),
      },
    )

    const res = await action({
      request,
      params: {id},
      context: {},
    })

    // Check that the response is correct
    expect(res.ok).toBeTruthy()
    expect(await res.json()).toStrictEqual(
      expect.objectContaining({
        id,
        status: 'succeeded',
      }),
    )

    const receivedPayload = await waitForRequest('POST', env.DEV_WEBHOOK_URL!)

    // Check that the webhook was called with correct payload
    expect(await receivedPayload.json()).toStrictEqual(
      expect.objectContaining({
        id: expect.any(String),
        idempotenceKey: expect.any(String),
        event: 'payment_intent.succeeded',
        data: expect.objectContaining({
          paymentIntent: expect.objectContaining({
            id: expect.any(String),
            status: 'succeeded',
            transactions: expect.arrayContaining([
              expect.objectContaining({
                id: expect.any(String),
                amount: amount.toString(),
                confirmations: 1,
              }),
            ]),
          }),
        }),
      }),
    )
  })

  test.todo(
    'should be able to simulate a processing payment',
    async ({faker, request: {authorize, parseFormData}}) => {
      // Create a fake payment intent
      const {id, accountId, amount, currency, confirmations} =
        await faker.db.paymentIntent()

      // const pi = await request.post(`/api/payment-intents/${id}/simulate-payment`)
      let request = new Request(
        `http://app.com/api/payment-intents/${id}/simulate-payment`,
        {
          method: 'POST',
          headers: await authorize({accountId}),
          body: parseFormData({
            amount,
            currency,
            confirmations: confirmations - 1,
          }),
        },
      )

      const res = await action({
        request,
        params: {id},
        context: {},
      })
      // Check that the response is correct
      expect(res.ok).toBeTruthy()
      expect(await res.json()).toStrictEqual(
        expect.objectContaining({
          id,
          status: 'processing',
        }),
      )
    },
  )
})
