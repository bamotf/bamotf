import {z} from '../utils/zod'

import {AddressSchema} from './address.schema'
import {AmountSchema} from './amount.schema'

export const PaymentIntentSchema = z.object(
  // <
  //   Schema<PaymentIntent, HiddenFields>
  // >
  {
    id: z.string(),
    /**
     * @type {string} - The address the user needs to pay to
     */
    address: z.string(),
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
