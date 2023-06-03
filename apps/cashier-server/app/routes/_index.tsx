import type {LoaderArgs, V2_MetaFunction} from '@remix-run/node'
import {Form} from '@remix-run/react'
import {typedjson, useTypedLoaderData} from 'remix-typedjson'
import {PaymentIntentSchema} from '~/schemas'
import {createContract} from '~/utils/contract'
import type {PaymentIntent, Transaction} from '~/utils/prisma.server';
import { prisma} from '~/utils/prisma.server'

export const meta: V2_MetaFunction = () => {
  return [
    {title: 'New Remix App'},
    {name: 'description', content: 'Welcome to Remix!'},
  ]
}

export const contract = createContract({
  action: {
    body: PaymentIntentSchema.pick({
      amount: true,
      address: true,
    }),
  },
})

export async function loader({params, request}: LoaderArgs) {
  const paymentIntents = await prisma.paymentIntent.findMany({
    include: {transactions: true},
  })
  return typedjson({paymentIntents})
}

export default function Index() {
  const {paymentIntents} = useTypedLoaderData<typeof loader>()

  return (
    <div>
      <h1 className="text-3xl">All Payment intents</h1>
      <ul>
        {paymentIntents.map(paymentIntent => (
          <PaymentIntentItem key={paymentIntent.id} {...paymentIntent} />
        ))}

        <h1 className="mt-4 text-2xl">Simulate payment</h1>
        <Form method="post" action="/simulate">
          <div className="flex flex-col">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              name="amount"
              id="amount"
              className="border border-gray-400 rounded-lg"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              name="address"
              id="address"
              className="border border-gray-400 rounded-lg"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-md px-4 py-2"
          >
            Submit
          </button>
        </Form>
      </ul>
    </div>
  )
}

function PaymentIntentItem(
  props: PaymentIntent & {
    transactions: Transaction[]
  },
) {
  const {transactions, ...paymentIntent} = props

  const confirmedTransactions = transactions.filter(
    transaction => transaction.confirmations > 0,
  )

  const confirmedAmount = confirmedTransactions.reduce((acc, transaction) => {
    return acc + transaction.amount
  }, BigInt(0))

  const isConfirmed = confirmedAmount >= paymentIntent.amount

  return (
    <li className="border border-gray-400 p-4 my-4">
      {isConfirmed ? (
        <span className="text-green-500">Confirmed</span>
      ) : (
        <span className="text-red-500">Not confirmed</span>
      )}
      - {paymentIntent.amount.toString()} - {paymentIntent.address}
      <table>
        <thead>
          <tr>
            <th>Amount</th>
            <th>Confirmations</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(transaction => (
            <tr key={transaction.id}>
              <td>{transaction.amount.toString()}</td>
              <td>{transaction.confirmations}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </li>
  )
}
