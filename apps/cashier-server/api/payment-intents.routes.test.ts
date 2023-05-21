import {prisma} from 'db'
import * as bitcoin from './utils/bitcoin'

import {describe, expect, test, vi} from 'vitest'

import {Job} from 'quirrel'
import type supertest from 'supertest'
import TransactionQueue, {
  TransactionQueuePayload,
} from '../pages/api/queues/transaction'
import {request, server} from '../tests/next-server'

import * as webhookServer from '../tests/webhook-server'

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

describe('[POST] /api/payment-intents', () => {
  describe('when it works', async () => {
    test('should respond with a 200 status code when passed correct data', async () => {
      const response = await request.post('/api/payment-intents').send({
        amount: 100,
        // address: '1Dg5jKw5bfW8uV1LbiY1YXcx7KjQPK8uV7',
        address: 'bcrt1qkg5kdqcxlzecaqws4ha80d2twttle869z0ugjv',
      })
      expect(response.ok).toBeTruthy()
      expect(response.body).toStrictEqual(
        expect.objectContaining({
          id: expect.any(String),
          amount: 100,
        }),
      )
    })

    test('should trigger webhook and job has stopped', async () => {
      let response: supertest.Response
      const expectedPayload = {id: 1, name: 'foo'}

      // This is a fairly complex test, so let's break it down:
      // 1. start the server that will receive the trigger from queue and execute the job
      // 2. start the server that will receive the webhook from job
      // 3. trigger the endpoint that will enqueue the job
      server.listen(3000, async () => {
        webhookServer.listen(async () => {
          const address = 'bcrt1qkg5kdqcxlzecaqws4ha80d2twttle869z0ugjv'

          // add payment intent
          response = await request.post('/api/payment-intents').send({
            amount: 100,
            // address: '1Dg5jKw5bfW8uV1LbiY1YXcx7KjQPK8uV7',
            address,
          })

          await bitcoin.simulatePayment({
            address,
            amount: 100,
          })
        })
      })

      const receivedPayload = await webhookServer.onServerCalled()
      expect(receivedPayload).toEqual(expectedPayload)

      // Make sure the job has been removed from the queue
      const jobs: Job<TransactionQueuePayload>[] = []
      for await (const jobsInterator of TransactionQueue.get()) {
        ;[...jobsInterator].forEach(job => {
          jobs.push(job)
        })
      }

      const job = jobs.find(
        job => job.body.paymentIntentId === response.body.id,
      )
      expect(job).toBeFalsy()
    })
  })

  test('should respond with a 400 status code if an invalid request body is provided', async () => {
    const pi = await request.post('/api/payment-intents').send({
      amount: -1,
    })

    expect(pi.status).toBe(400)
    expect(await pi.body).toStrictEqual(
      expect.objectContaining({
        issues: expect.objectContaining({}),
      }),
    )
  })
})

describe('[GET] /api/payment-intents', () => {
  test('should respond with a 200 status code', async () => {
    // Create a fake payment intent
    await createFakePaymentIntent()

    // Get all payment intents
    const pi = await request.get('/api/payment-intents')

    // Check that the response is correct
    expect(pi.ok).toBeTruthy()
    expect(await pi.body).toStrictEqual(
      expect.objectContaining({
        data: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            amount: 100,
          }),
        ]),
        total: 1,
      }),
    )
  })
})

describe('[GET] /api/payment-intents/:id', () => {
  test('should respond with a 200 status code', async () => {
    // Create a fake payment intent
    const {id} = await createFakePaymentIntent()

    // Get the payment intent
    const pi = await request.get(`/api/payment-intents/${id}`)

    // Check that the response is correct
    expect(pi.ok).toBeTruthy()
    expect(await pi.body).toStrictEqual(
      expect.objectContaining({
        id: expect.any(String),
        amount: 100,
      }),
    )
  })
})

describe('[POST] /api/payment-intents/:id', () => {
  test('should respond with a 200 status code', async () => {
    // Create a fake payment intent
    const {id} = await createFakePaymentIntent()

    // Update the payment intent
    const pi = await request.post(`/api/payment-intents/${id}`).send({
      amount: 200,
    })

    // Check that the response is correct
    expect(pi.ok).toBeTruthy()
    expect(await pi.body).toStrictEqual(
      expect.objectContaining({
        id: expect.any(String),
        amount: 200,
      }),
    )
  })
})

describe('[POST] /api/payment-intents/:id/cancel', () => {
  test('should respond with a 200 status code', async () => {
    // Create a fake payment intent
    const {id} = await createFakePaymentIntent()

    // Cancel the payment intent
    const pi = await request.post(`/api/payment-intents/${id}/cancel`).send({})

    // Check that the response is correct
    expect(pi.ok).toBeTruthy()
    expect(await pi.body).toStrictEqual(
      expect.objectContaining({
        status: 'canceled',
      }),
    )
  })
})
