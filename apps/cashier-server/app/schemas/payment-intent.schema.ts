import {Schema} from 'zod-prisma-utils'
import {z} from '~/utils/zod'

import {AddressSchema} from './address.schema'
import {AmountSchema} from './amount.schema'
import type {PaymentIntent} from '~/utils/prisma.server'

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
  description: z.string().nullish(),
  status: z.enum(['pending', 'canceled', 'succeeded']),
  canceledAt: z.date().optional(),
  cancellationReason: z.string().optional(),
  confirmations: z.number().default(6),
  // accountId: z.string().uuid().optional(),
} satisfies SchemaType)
