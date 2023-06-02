import {expect, test} from 'tests/base.fixture'
import {prisma} from '~/utils/prisma.server'
import * as bitcoinCore from '../utils/bitcoin-core'
import * as webhookServer from '../../tests/webhook-server'
import {APIResponse} from '@playwright/test'
import {queue} from '~/queues/transaction.server'

function createFakePaymentIntent(props?: {amount?: number; address?: string}) {
  const {amount = 100, address = '1Dg5jKw5bfW8uV1LbiY1YXcx7KjQPK8uV7'} =
    props || {}
  return prisma.paymentIntent.create({
    data: {
      amount: amount,
      address,
    },
  })
}

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
          amount: '100',
        }),
      )
    })

    test('should trigger webhook and job has stopped', async ({request}) => {
      let response: APIResponse | undefined
      const expectedPayload = {id: 1, name: 'foo'}

      // This is a fairly complex test, so let's break it down:
      // 1. start the server that will receive the webhook from job
      // 2. trigger the endpoint that will enqueue the job
      webhookServer.listen(async () => {
        const address = 'bcrt1qkg5kdqcxlzecaqws4ha80d2twttle869z0ugjv'
        // add payment intent
        response = await request.post('/api/payment-intents', {
          data: {
            amount: 100,
            address,
          },
        })
        await bitcoinCore.simulatePayment({
          address,
          amount: 100,
        })
      })

      const receivedPayload = await webhookServer.onServerCalled()
      expect(receivedPayload).toEqual(expectedPayload)

      // Make sure the job has been removed from the queue
      const jobs = await queue.getJobs()
      expect(jobs).toHaveLength(0)

      if (!response) {
        throw new Error('Response is undefined')
      }

      const data = await response.json()
      const job = jobs.find(job => job.data.paymentIntentId === data.id)
      expect(job).toBeFalsy()
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
  test('should respond with a 200 status code', async ({request}) => {
    // Create a fake payment intent
    await createFakePaymentIntent()

    // Get all payment intents
    const pi = await request.get('/api/payment-intents')

    // Check that the response is correct
    expect(pi.ok()).toBeTruthy()
    expect(await pi.json()).toStrictEqual(
      expect.objectContaining({
        data: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            amount: '100',
          }),
        ]),
        total: 1,
      }),
    )
  })
})
