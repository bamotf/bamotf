import {rest, type DefaultBodyType, type MockedRequest} from 'msw'
import {afterEach, beforeEach, describe, expect, test} from 'tests/base.fixture'
import faker from 'tests/faker'
import {server, waitForRequest} from 'tests/setup.integration'

import {queue as transactionQueue} from '~/queues/transaction.server'
import {queue as watchPIQueue} from '~/queues/watch-pi.server'
import {getBtcAmountFromFiat} from '~/utils/price'
import {action, loader} from './api.payment-intents._index'

describe('[POST] /api/payment-intents', () => {
  test('should respond with a 200 status code when passed correct data', async ({
    request: {parseFormData, authorize},
    faker,
  }) => {
    const data = faker.model.paymentIntent()

    // const response = await request.post('/api/payment-intents', {
    //   data,
    // })
    let request = new Request(`http://app.com/api/payment-intents`, {
      method: 'POST',
      body: parseFormData(data),
      headers: await authorize(),
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
  })

  describe('when the webhook responds', async () => {
    let webhookRequests: Promise<MockedRequest<DefaultBodyType>>[]
    let accountId: string | undefined
    const mode = 'test'

    beforeEach(async () => {
      // Initialize a fake account with a fake webhook
      const account = await faker.db.account()
      accountId = account.id
      webhookRequests = []
      const webhooks = faker.helpers.multiple(
        () =>
          faker.db.webhook({
            accountId,
            mode,
          }),
        {
          count: {min: 1, max: 3},
        },
      )

      webhooks.forEach(async webhookPromise => {
        const webhook = await webhookPromise

        server.use(
          rest.post(webhook.url, async (req, res, ctx) => {
            return res(ctx.json({success: true}))
          }),
        )

        webhookRequests.push(waitForRequest('POST', webhook.url))
      })
    })

    afterEach(async () => {
      // HACK: this is a hack to make sure the test is finished and nothing else is running
      await new Promise(resolve => setTimeout(resolve, 200))
    })

    test('should trigger webhook and stop job', async ({
      request: {parseFormData, authorize},
      bitcoinCore,
      faker,
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
        headers: await authorize({
          accountId,
          mode,
        }),
      })

      const response = await action({
        request,
        params: {},
        context: {},
      })
      expect(response.ok).toBeTruthy()

      // Simulate the payment in the background
      await bitcoinCore.simulatePayment({
        address,
        amount,
        network: mode,
      })

      // Wait for the webhooks to be called

      await Promise.all(webhookRequests)

      const data = await response.json()

      // Make sure the job has been removed from the queue
      const watchJobs = await watchPIQueue.getJobs('completed')
      const watchJob = watchJobs.find(
        job => job.data.paymentIntentId === data.id,
      )
      expect(watchJob).toBeTruthy()

      const transactionJobs = await transactionQueue.getJobs('completed')
      const transactionJob = transactionJobs.find(
        job => job.data.paymentIntentId === data.id,
      )
      expect(transactionJob).toBeTruthy()
    })

    test('should accept payments with another currency', async ({
      request: {parseFormData, authorize},
      bitcoinCore,
      faker,
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
        headers: await authorize({
          accountId,
          mode,
        }),
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

      // Simulate the payment in the background
      await bitcoinCore.simulatePayment({
        address,
        amount: amountToPay,
        network: mode,
      })

      // Wait for the webhook to be called
      const receivedPayloads = await Promise.all(webhookRequests)

      const payload = await receivedPayloads[0].json()
      expect(payload).toStrictEqual(
        expect.objectContaining({
          data: expect.objectContaining({
            paymentIntent: expect.objectContaining({
              status: 'succeeded',
              transactions: expect.arrayContaining([
                expect.objectContaining({
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

    test('should accept payments after some other PI have not been completed', async ({
      request: {parseFormData, authorize},
      bitcoinCore,
      faker,
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
          headers: await authorize({
            accountId,
            mode,
          }),
        })

        const response = await action({
          request,
          params: {},
          context: {},
        })
        expect(response.ok).toBeTruthy()
      }

      // Simulate the payment to the last payment intent
      const lastPaymentIntent = paymentIntents[paymentIntents.length - 1]

      await bitcoinCore.simulatePayment({
        address: lastPaymentIntent.address,
        amount: lastPaymentIntent.amount,
        network: mode,
      })

      // Wait for the webhook to be called
      const receivedPayloads = await Promise.all(webhookRequests)

      const payload = await receivedPayloads[0].json()
      expect(payload).toStrictEqual(
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
    request: {parseFormData, authorize},
  }) => {
    await faker.db.account()
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
      headers: await authorize(),
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
  test('should respond with a 200 status code', async ({
    faker,
    request: {authorize},
  }) => {
    // Create a fake payment intent
    const {amount} = await faker.db.paymentIntent()

    // Get all payment intents
    // const pi = await request.get('/api/payment-intents')
    let request = new Request(`http://app.com/api/payment-intents`, {
      method: 'GET',
      headers: await authorize(),
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
