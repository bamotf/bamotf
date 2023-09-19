// TODO: This file should be generated from the OpenAPI spec

import type {CurrencyCode} from '../../../config/currency'

export type PaymentIntentStatus =
  | 'pending'
  | 'processing'
  | 'succeeded'
  | 'canceled'

export type PaymentIntent = {
  id: string
  amount: bigint
  tolerance: number
  address: string
  status: PaymentIntentStatus
  confirmations: number
  currency: CurrencyCode
  canceledAt: Date | null
  cancellationReason: string | null
  description: string | null
  metadata: unknown | null
  createdAt: Date
  updatedAt: Date
}

export type ListResult = {
  data: PaymentIntent[]
  total: number
}
export type CreateBodyParams = {
  address: string
  amount: number
  tolerance?: number
  confirmations?: number
  currency?: CurrencyCode
  description?: string
}

export type CreateResult = PaymentIntent

export type RetrieveResult = PaymentIntent
export type UpdateBodyParams = {
  address?: string
  amount?: bigint
  tolerance?: number
  confirmations?: number
  currency?: CurrencyCode
  description?: string | null
}

export type UpdateResult = PaymentIntent

export type CancelBodyParams = {
  cancellationReason?: string | null
}
export type CancelResult = PaymentIntent

export type WebhookEvent = {
  id: string
  idempotenceKey: string
  created: string
  event: `payment_intent.${PaymentIntentStatus}`
  data: {
    paymentIntent: PaymentIntent
  }
}
