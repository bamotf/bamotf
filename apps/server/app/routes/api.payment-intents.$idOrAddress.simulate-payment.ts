import {type LoaderArgs} from '@remix-run/node'
import {typedjson} from 'remix-typedjson'

import {PaymentIntentIdSchema, PaymentIntentSchema} from '~/schemas'
import {requireValidApiKey} from '~/utils/auth.server'
import {createContract} from '~/utils/contract'
import {env} from '~/utils/env.server'
import {simulatePayment} from '~/utils/simulate-payment.server'
import {z} from '~/utils/zod'

export const contract = createContract({
  action: {
    pathParams: z.object({
      idOrAddress: PaymentIntentIdSchema,
    }),
    body: PaymentIntentSchema.pick({
      amount: true,
      currency: true,
      confirmations: true,
    }),
  },
})

/**
 * Cancels a PaymentIntent object.
 */
export async function action({request, params}: LoaderArgs) {
  if (!env.DEV_MODE_ENABLED) {
    throw new Response(
      'Payment intent simulation is only available in dev mode',
      {status: 400},
    )
  }

  const {accountId, mode} = await requireValidApiKey(request)

  if (mode !== 'dev') {
    throw new Response(
      `You can not simulate a payment from a '${mode}' mode. Those payments rely on the blockchain to be confirmed.`,
    )
  }

  const {path, body} = await contract.action({request, params})
  const {idOrAddress} = path
  const result = await simulatePayment({idOrAddress, accountId}, body)

  return typedjson(result)
}
