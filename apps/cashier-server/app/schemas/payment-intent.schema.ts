import type {Schema} from 'zod-prisma-utils'
import {zpu} from 'zod-prisma-utils'
import {CURRENCY_CODES} from '~/config/currency'
import type {PaymentIntent} from '~/utils/prisma.server'
import {z} from '~/utils/zod'
import {AmountSchema} from './amount.schema'

type SchemaType = Schema<PaymentIntent, 'createdAt' | 'updatedAt'>

export const PaymentIntentSchema = z.object({
  /**
   * @type {string} - The id of the payment intent
   */
  id: z.string(),
  /**
   * @type {string} - The address the user needs to pay to
   */
  address: z.string(),
  /**
   * @type {bigint} - The amount the user needs to pay in satoshis
   */
  amount: AmountSchema,
  confirmations: z.number().default(1),
  currency: z.enum(CURRENCY_CODES).default('BTC'),
  status: z.enum(['pending', 'canceled']),
  description: z.string().nullish(),
  metadata: zpu.json().nullish(),
  canceledAt: z.date().optional(),
  cancellationReason: z.string().optional(),
} satisfies SchemaType)
