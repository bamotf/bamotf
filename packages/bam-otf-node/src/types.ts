// import type * as root from 'bam-otf-server/app/routes/api.payment-intents._index'
// import type * as specific from 'bam-otf-server/app/routes/api.payment-intents.$id._index'
// import type * as cancel from 'bam-otf-server/app/routes/api.payment-intents.$id.cancel'

import type {CurrencyCode} from 'bam-otf-server/app/config/currency'

export const paymentIntentStatus = {
  pending: 'pending',
  processing: 'processing',
  succeeded: 'succeeded',
  canceled: 'canceled',
}

export type PaymentIntentStatus =
  (typeof paymentIntentStatus)[keyof typeof paymentIntentStatus]

export type PaymentIntent = {
  id: string
  amount: number
  tolerance: number
  address: string
  status: PaymentIntentStatus
  confirmations: number
  currency: string
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
  amount?: number
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
  event: 'payment_intent.succeeded'
  data: {
    paymentIntent: PaymentIntent
  }
}
