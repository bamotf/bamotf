import type {PaymentIntent} from 'db'
import {initContract} from '@ts-rest/core'
import {PaymentIntentSchema} from './payment-intents.schemas'

const c = initContract()

export const contract = c.router({
  /**
   * Creates a PaymentIntent object.
   *
   * After the PaymentIntent is created, the service will monitor the
   * blockchain in order to confirm this transaction.
   */
  createPaymentIntent: {
    method: 'POST',
    path: '/payment-intents',
    body: PaymentIntentSchema.pick({amount: true}),
    responses: {
      200: c.response<PaymentIntent>(),
    },
    summary: 'Create a new payment intent',
  },

  listAllPaymentIntents: {
    method: 'GET',
    path: '/payment-intents',
    responses: {
      200: c.response<{data: PaymentIntent[]}>(),
    },
    summary: 'List all payment intents',
  },

  getPaymentIntent: {
    method: 'GET',
    path: '/payment-intents/:id',
    pathParams: PaymentIntentSchema.pick({id: true}),
    responses: {
      200: c.response<PaymentIntent>(),
    },
    summary: 'List all payment intents',
  },

  updatePaymentIntent: {
    method: 'POST',
    path: '/payment-intents/:id',
    pathParams: PaymentIntentSchema.pick({id: true}),
    body: PaymentIntentSchema.pick({amount: true}),
    responses: {
      200: c.response<PaymentIntent>(),
    },
    summary: 'Update a payment intent',
  },

  cancelPaymentIntent: {
    method: 'POST',
    path: '/payment-intents/:id/cancel',
    pathParams: PaymentIntentSchema.pick({id: true}),
    body: {},
    responses: {
      200: c.response<PaymentIntent>(),
    },
    summary: 'Cancel a payment intent',
  },
})
