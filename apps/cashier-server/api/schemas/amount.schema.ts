import {z} from '../utils/zod'

const MIN_AMOUNT = 0
const MAX_AMOUNT = 21_000_000 * 100_000_000

export const AmountSchema = z.coerce.number().min(MIN_AMOUNT).max(MAX_AMOUNT)
