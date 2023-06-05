import {expect, test} from 'tests/base.fixture'
import {FIAT_CURRENCY_CODES} from '~/config/currency'
import {queue} from '~/queues/transaction.server'
import {getBtcAmountFromFiat} from '~/utils/price'
import {WebhookTestServer} from '../../tests/webhook-server'

test.describe('[POST] /api/payment-intents', () => {
  test.describe('when it works', async () => {
    test('should respond with a 200 status code when passed correct data', async ({
      request,
    }) => {
      const response = await request.post('/api/payment-intents', {
        data: {
          amount: 100,
          address: 'bcrt1qkg5kdqcxlzecaqws4ha80d2twttle869z0ugjv',
        },
      })
      expect(response.ok()).toBeTruthy()
      expect(await response.json()).toStrictEqual(
        expect.objectContaining({
          id: expect.any(String),
          amount: 100,
        }),
      )
    })

    test('should trigger webhook and job has stopped', async ({
      request,
      bitcoinCore,
      faker,
    }) => {
      const address = faker.bitcoin.createRandomAddress()
      const amount = 0.00_001_000

      // This is a fairly complex test, so let's break it down:
      // 1. start the server that will receive the webhook from job
      // 2. trigger the endpoint that will enqueue the job
      const webhook = new WebhookTestServer()
      await webhook.listen()

      // Create a fake payment intent
      const response = await request.post('/api/payment-intents', {
        data: {
          amount,
          confirmations: 1,
          address,
        },
      })

      // Wait for the webhook to be called
      const receivedPayload = webhook.onServerCalled()

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
                  amount,
                  confirmations: 1,
                }),
              ]),
            }),
          }),
        }),
      )

      // Make sure the job has been removed from the queue
      const jobs = await queue.getJobs('completed')
      expect(jobs).toHaveLength(1)

      if (!response) {
        throw new Error('Response is undefined')
      }

      const data = await response.json()
      const job = jobs.find(job => job.data.paymentIntentId === data.id)
      expect(job).toBeTruthy()
    })

    test('should accept payments with another currency', async ({
      request,
      bitcoinCore,
      faker,
    }) => {
      const currency = faker.helpers.arrayElement(FIAT_CURRENCY_CODES)
      const address = faker.bitcoin.createRandomAddress()
      const amountInFiat = faker.number.float({min: 1, max: 100, precision: 2})
      const tolerance = 0.02

      // This is a fairly complex test, so let's break it down:
      // 1. start the server that will receive the webhook from job
      // 2. trigger the endpoint that will enqueue the job
      const webhook = new WebhookTestServer()
      await webhook.listen()

      // Create a fake payment intent
      await request.post('/api/payment-intents', {
        data: {
          currency,
          amount: amountInFiat,
          confirmations: 1,
          address,
          tolerance,
        },
      })

      const amountToPay = await getBtcAmountFromFiat({
        amount: amountInFiat,
        currency,
      })

      // Wait for the webhook to be called
      const receivedPayload = webhook.onServerCalled()

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
                  amount: amountToPay,
                  // TODO: this should be the original amount at the time of the payment
                  originalAmount: expect.any(Number),
                }),
              ]),
            }),
          }),
        }),
      )

      expect(
        // @ts-ignore
        payload.data.paymentIntent.transactions[0].originalAmount,
      ).toBeGreaterThan(amountInFiat * tolerance)
    })
  })

  test('should respond with a 400 status code if an invalid request body is provided', async ({
    request,
  }) => {
    const pi = await request.post('/api/payment-intents', {
      data: {
        amount: -1,
      },
    })
    expect(pi.status()).toBe(400)
    expect(await pi.json()).toStrictEqual(
      expect.objectContaining({
        issues: expect.objectContaining({}),
      }),
    )
  })
})

test.describe('[GET] /api/payment-intents', () => {
  test('should respond with a 200 status code', async ({request, faker}) => {
    // Create a fake payment intent
    const {amount} = await faker.paymentIntent.createFakePaymentIntent()

    // Get all payment intents
    const pi = await request.get('/api/payment-intents')

    // Check that the response is correct
    expect(pi.ok()).toBeTruthy()
    expect(await pi.json()).toStrictEqual(
      expect.objectContaining({
        data: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            amount: amount.toNumber(),
          }),
        ]),
        total: 1,
      }),
    )
  })
})
