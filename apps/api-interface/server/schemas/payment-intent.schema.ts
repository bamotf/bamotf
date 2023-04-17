import {z} from '../utils/zod'

import type {PaymentIntent} from 'db'
import type {Schema} from 'zod-prisma-utils'

import {AddressSchema} from './address.schema'
import {AmountSchema} from './amount.schema'

type HiddenFields = 'createdAt' | 'updatedAt' | 'canceledAt'

export const PaymentIntentSchema = z.object(
  // <
  //   Schema<PaymentIntent, HiddenFields>
  // >
  {
    id: z.string(),
    /**
     * @type {string} - The address the user needs to pay to
     */
    address: AddressSchema,
    /**
     * @type {bigint} - The amount the user needs to pay in satoshis
     */
    amount: AmountSchema,
    /**
     * @type {bigint} - The amount the user has already payed in satoshis
     */
    amountReceived: AmountSchema,
    description: z.string().optional(),
    status: z.enum(['CONFIRMING', 'CANCELED', 'SUCCEEDED']),
    cancellationReason: z.string().optional(),
  },
)
