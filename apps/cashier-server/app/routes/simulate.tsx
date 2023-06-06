import {json, type ActionArgs} from '@remix-run/node'

import {PaymentIntentSchema} from '~/schemas'
import {simulatePayment} from '~/utils/bitcoin-core'
import {createContract} from '~/utils/contract'

export const contract = createContract({
  action: {
    body: PaymentIntentSchema.pick({
      amount: true,
      address: true,
    }),
  },
})

export async function action({request}: ActionArgs) {
  const {body} = await contract.action({request})
  const result = await simulatePayment(body)
  return json(result)
}
