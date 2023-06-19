import {json, type ActionArgs} from '@remix-run/node'
import {Form} from '@remix-run/react'

import {Input} from '~/components/ui/input'
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

export default function SimulatePage() {
  return (
    <Form method="post">
      Amount
      <Input type="text" name="amount" />
      address
      <Input type="text" name="address" />
      <button type="submit">Submit</button>
    </Form>
  )
}
