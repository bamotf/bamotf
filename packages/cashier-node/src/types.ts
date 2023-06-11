// import type * as root from 'cashier-server/app/routes/api.payment-intents._index'
// import type * as specific from 'cashier-server/app/routes/api.payment-intents.$id._index'
// import type * as cancel from 'cashier-server/app/routes/api.payment-intents.$id.cancel'

import type {PaymentIntentStatus} from '@prisma/client'
import type {CurrencyCode} from 'cashier-server/app/config/currency'

type PaymentIntent = {
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
