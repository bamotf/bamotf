import {afterEach, beforeEach, describe, expect, test} from 'tests/base.fixture'

import {queue} from '~/queues/transaction.server'
import {getBtcAmountFromFiat} from '~/utils/price'
import {WebhookTestServer} from '../../tests/webhook-server'
import {action, loader} from './api.payment-intents._index'

describe('[POST] /api/payment-intents', () => {
  describe('when it works', async () => {
    let webhook: WebhookTestServer | undefined

    beforeEach(async () => {
      // This is a fairly complex test, so let's break it down:
      // 1. start the server that will receive the webhook from job
      // 2. trigger the endpoint that will enqueue the job
      webhook = new WebhookTestServer()
      await webhook.listen()
    })

    afterEach(async () => {
      // wait for the webhook to be called and other stuff to finish
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Stop the webhook server
      await webhook?.server.close()
    })

    test('should respond with a 200 status code when passed correct data', async ({
      request: {parseFormData},
      faker,
      headers,
    }) => {
      const data = faker.model.paymentIntent()

      // const response = await request.post('/api/payment-intents', {
      //   data,
      // })
      let request = new Request(`http://app.com/api/payment-intents`, {
        method: 'POST',
        body: parseFormData(data),
        headers,
      })

      const response = await action({
        request,
        params: {},
        context: {},
      })

      expect(response.ok).toBeTruthy()
      expect(await response.json()).toStrictEqual(
        expect.objectContaining({
          id: expect.any(String),
          ...data,
          amount: data.amount.toString(),
        }),
      )
      expect(webhook?.onServerCalled()).toBeTruthy()
    })

    test('should trigger webhook and stop job', async ({
      request: {parseFormData},
      bitcoinCore,
      faker,
      headers,
    }) => {
      const {address, amount} = faker.model.paymentIntent({currency: 'BTC'})

      // Create a fake payment intent
      // const response = await request.post('/api/payment-intents', {
      //   data: {
      //     amount,
      //     confirmations: 1,
      //     address,
      //   },
      // })
      let request = new Request(`http://app.com/api/payment-intents`, {
        method: 'POST',
        body: parseFormData({
          amount,
          confirmations: 1,
          address,
        }),
        headers,
      })

      const response = await action({
        request,
        params: {},
        context: {},
      })
      expect(response.ok).toBeTruthy()

      // Wait for the webhook to be called
      const receivedPayload = webhook?.onServerCalled()

      // Simulate the payment in the background
      await bitcoinCore.simulatePayment({
        address,
        amount,
      })
      expect(await receivedPayload).toStrictEqual(
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

      // Make sure the job has been removed from the queue
      const jobs = await queue.getJobs('completed')
      const data = await response.json()
      const job = jobs.find(job => job.data.paymentIntentId === data.id)
      expect(job).toBeTruthy()
    })

    test('should accept payments with another currency', async ({
      request: {parseFormData},
      bitcoinCore,
      faker,
      headers,
    }) => {
      const currency = faker.model.fiat()
      const {address, amount, tolerance} = faker.model.paymentIntent({currency})

      // Create a fake payment intent
      // await request.post('/api/payment-intents', {
      //   data: {
      //     currency,
      //     amount,
      //     confirmations: 1,
      //     address,
      //     tolerance,
      //   },
      // })
      let request = new Request(`http://app.com/api/payment-intents`, {
        method: 'POST',
        body: parseFormData({
          currency,
          amount,
          confirmations: 1,
          address,
          tolerance,
        }),
        headers,
      })

      await action({
        request,
        params: {},
        context: {},
      })

      const amountToPay = await getBtcAmountFromFiat({
        amount: amount as bigint,
        currency,
      })

      // Wait for the webhook to be called
      const receivedPayload = webhook?.onServerCalled()

      // Simulate the payment in the background
      await bitcoinCore.simulatePayment({
        address,
        amount: amountToPay,
      })

      const payload = await receivedPayload
      expect(payload).toStrictEqual(
        expect.objectContaining({
          data: expect.objectContaining({
            paymentIntent: expect.objectContaining({
              status: 'succeeded',
              transactions: expect.arrayContaining([
                expect.objectContaining({
                  amount: amountToPay.toString(),
                  // TODO: this should be the original amount at the time of the payment
                  originalAmount: expect.any(String),
                }),
              ]),
            }),
          }),
        }),
      )

      expect(
        // @ts-ignore
        Number(payload.data.paymentIntent.transactions[0].originalAmount),
      ).toBeGreaterThan(Number(amount) * tolerance)
    })

    test('should accept payments after some payments have not been completed', async ({
      request: {parseFormData},
      bitcoinCore,
      faker,
      headers,
    }) => {
      const paymentIntents = [
        faker.model.paymentIntent({currency: 'BTC'}),
        faker.model.paymentIntent({currency: 'BTC'}),
        faker.model.paymentIntent({currency: 'BTC'}),
      ]

      // Create all payment intents
      for (const pi of paymentIntents) {
        // const response = await request.post('/api/payment-intents', {
        //   data: {
        //     ...pi,
        //     confirmations: 1,
        //   },
        // })

        let request = new Request(`http://app.com/api/payment-intents`, {
          method: 'POST',
          body: parseFormData({
            ...pi,
            confirmations: 1,
          }),
          headers,
        })

        const response = await action({
          request,
          params: {},
          context: {},
        })
        expect(response.ok).toBeTruthy()
      }

      // Wait for the webhook to be called
      const receivedPayload = webhook?.onServerCalled()

      // Simulate the payment to the last payment intent
      const lastPaymentIntent = paymentIntents[paymentIntents.length - 1]
      await bitcoinCore.simulatePayment({
        address: lastPaymentIntent.address,
        amount: lastPaymentIntent.amount,
      })

      expect(await receivedPayload).toStrictEqual(
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
                  amount: lastPaymentIntent.amount.toString(),
                  confirmations: 1,
                }),
              ]),
            }),
          }),
        }),
      )
    })
  })

  test('should respond with a 400 status code if an invalid request body is provided', async ({
    request: {parseFormData},
    headers,
  }) => {
    // const pi = await request.post('/api/payment-intents', {
    //   data: {
    //     amount: -1,
    //   },
    // })

    const data = {
      amount: '-1',
    }

    let request = new Request(`http://app.com/api/payment-intents`, {
      method: 'POST',
      body: parseFormData(data),
      headers,
    })

    try {
      await action({
        request,
        params: {},
        context: {},
      })
    } catch (pi: unknown) {
      if (pi instanceof Response) {
        expect(pi.status).toBe(400)
        expect(await pi.json()).toStrictEqual(
          expect.objectContaining({
            issues: expect.objectContaining({}),
          }),
        )
      }
    }
  })
})

describe('[GET] /api/payment-intents', () => {
  test('should respond with a 200 status code', async ({faker, headers}) => {
    // Create a fake payment intent
    const {amount} = await faker.db.paymentIntent()

    // Get all payment intents
    // const pi = await request.get('/api/payment-intents')
    let request = new Request(`http://app.com/api/payment-intents`, {
      method: 'GET',
      headers,
    })
    const pi = await loader({
      request,
      context: {},
      params: {},
    })

    // Check that the response is correct
    expect(pi.ok).toBeTruthy()
    expect(await pi.json()).toStrictEqual(
      expect.objectContaining({
        data: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            amount: amount.toString(),
          }),
        ]),
        total: 1,
      }),
    )
  })
})
