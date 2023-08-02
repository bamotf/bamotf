import {zpu, type Schema} from 'zod-prisma-utils'

import {Prisma, type PaymentIntent} from '~/utils/prisma.server'
import {z} from '~/utils/zod'
import {CURRENCY_CODES} from '../../../../config/currency'

type SchemaType = Schema<PaymentIntent, 'createdAt' | 'updatedAt'>

export const PaymentIntentSchema = z.object({
  /**
   * The id of the payment intent
   */
  id: z.string(),
  /**
   * The address the user needs to pay to
   */
  address: z.string(),
  /**
   * The amount the user needs to pay
   */
  amount: z.coerce.bigint(),
  confirmations: z.coerce.number().default(1),
  tolerance: z.coerce
    .number()
    .min(0)
    .max(1)
    .default(0.02)
    // TODO: this is a bug in zod-prisma-utils
    .transform(v => new Prisma.Decimal(v)) as unknown as ReturnType<
    typeof zpu.decimal
  >,
  currency: z.enum(CURRENCY_CODES).default('BTC'),
  status: z.enum(['pending', 'canceled']),
  description: z.string().nullish(),
  metadata: zpu.json().nullish(),
  canceledAt: z.date().optional(),
  cancellationReason: z.string().optional(),
  accountId: z.string(),
  mode: z.enum(['DEV', 'TEST', 'PROD']),
} satisfies SchemaType)

export const NewPaymentIntentSchema = PaymentIntentSchema.pick({
  address: true,
  amount: true,
  confirmations: true,
  currency: true,
  description: true,
  tolerance: true,
})

export const UpdatePaymentIntentSchema = NewPaymentIntentSchema.partial()
