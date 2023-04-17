import type {PaymentIntent} from 'db'
import {initContract} from '@ts-rest/core'
import {PaymentIntentSchema, ExtendedPublicKeySchema} from './schemas'
import {z} from 'zod'

const c = initContract()

export const contract = c.router({
  /**
   * Creates a PaymentIntent object.
   *
   * After the PaymentIntent is created, the service will monitor the
   * blockchain in order to confirm this transaction.
   */
  create: {
    method: 'POST',
    path: '/payment-intents',
    body: PaymentIntentSchema.pick({
      amount: true,
      description: true,
    }).and(
      PaymentIntentSchema.pick({address: true}).or(
        z.object({
          account: ExtendedPublicKeySchema,
        }),
      ),
    ),
    responses: {
      200: c.response<PaymentIntent>(),
      400: c.response<z.ZodError>(),
      401: c.response<string>(),
    },
    summary: 'Create a new payment intent',
  },

  /**
   * Lists all PaymentIntent objects.
   */
  list: {
    method: 'GET',
    path: '/payment-intents',
    responses: {
      200: c.response<{data: PaymentIntent[]}>(),
      401: c.response<string>(),
    },
    summary: 'List all payment intents',
  },

  /**
   * Retrieves a PaymentIntent object.
   */
  retrieve: {
    method: 'GET',
    path: '/payment-intents/:id',
    pathParams: PaymentIntentSchema.pick({id: true}),
    responses: {
      200: c.response<PaymentIntent>(),
      401: c.response<string>(),
    },
    summary: 'List all payment intents',
  },

  /**
   * Updates a PaymentIntent object.
   */
  update: {
    method: 'POST',
    path: '/payment-intents/:id',
    pathParams: PaymentIntentSchema.pick({id: true}),
    body: PaymentIntentSchema.pick({
      amount: true,
      address: true,
      description: true,
    }).partial(),
    responses: {
      200: c.response<PaymentIntent>(),
      401: c.response<string>(),
    },
    summary: 'Update a payment intent',
  },

  /**
   * Cancels a PaymentIntent object.
   */
  cancel: {
    method: 'POST',
    path: '/payment-intents/:id/cancel',
    pathParams: PaymentIntentSchema.pick({id: true}),
    body: PaymentIntentSchema.pick({cancellationReason: true}),
    responses: {
      200: c.response<PaymentIntent>(),
      401: c.response<string>(),
    },
    summary: 'Cancel a payment intent',
  },
})
