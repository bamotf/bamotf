import {prisma} from 'db'
import {generateMock} from '@anatine/zod-mock'

import {describe, afterAll, test, expect} from 'vitest'

import supertest from 'supertest'
import {server} from '../tests/server'
import {PaymentIntentSchema} from './schemas/payment-intent.schema'

const request = supertest(server)

afterAll(() => {
  server.close() // don't forget to close your server after your tests
})

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
  test('should respond with a 200 status code when passed correct data', async () => {
    const pi = await request.post('/api/payment-intents').send({
      amount: 100,
      address: '1Dg5jKw5bfW8uV1LbiY1YXcx7KjQPK8uV7',
    })

    expect(pi.ok).toBeTruthy()
    expect(pi.body).toStrictEqual(
      expect.objectContaining({
        id: expect.any(String),
        amount: 100,
      }),
    )
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
        status: 'CANCELLED',
      }),
    )
  })
})
