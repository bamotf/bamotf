import {json, type LoaderArgs} from '@remix-run/node'

import {createContract} from '~/utils/contract'
import {getBitcoinPrice} from '~/utils/price'
import {z} from '~/utils/zod'
import {FIAT_CURRENCY_CODES} from '../../../../config/currency'

export const contract = createContract({
  loader: {
    pathParams: z.object({
      currency: z.enum(FIAT_CURRENCY_CODES),
    }),
  },
})

/**
 * Retrieves the price of one bitcoin in the given currency.
 */
export async function loader({request, params}: LoaderArgs) {
  const {path} = await contract.loader({request, params})

  const {currency} = path

  const price = await getBitcoinPrice(currency)

  return json({price, currency})
}
