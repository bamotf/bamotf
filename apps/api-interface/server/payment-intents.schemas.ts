import {z} from './utils/zod'

import type {PaymentIntent} from 'db'
import type {Schema} from 'zod-prisma-utils'

type HiddenFields = 'createdAt' | 'updatedAt'

const MIN_AMOUNT = BigInt(0)
const MAX_AMOUNT = BigInt(21_000_000 * 100_000_000)

const amountSchema = z.coerce.bigint().min(MIN_AMOUNT).max(MAX_AMOUNT)

export const PaymentIntentSchema = z.object<
  Schema<PaymentIntent, HiddenFields>
>({
  id: z.string(),
  /**
   * @type {bigint} - The amount the user needs to pay in satoshis
   */
  amount: amountSchema,
  /**
   * @type {bigint} - The amount the user has already payed in satoshis
   */
  amountReceived: amountSchema,
  status: z.enum(['CONFIRMING', 'CANCELED', 'SUCCEEDED']),
})
