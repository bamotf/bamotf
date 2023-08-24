import {parse} from '@conform-to/zod'
import {
  json,
  type ActionArgs,
  type LoaderArgs,
  type V2_MetaFunction,
} from '@remix-run/node'
import {useNavigate} from '@remix-run/react'
import {typedjson} from 'remix-typedjson'

import {DataTable} from '~/components/data-table'
import {CalendarDateRangePicker} from '~/components/date-range-picker'
import {columns} from '~/components/payments/columns'
import {useFreshData} from '~/hooks/use-fresh-data'
import {PaymentIntentSchema} from '~/schemas'
import {getAccountByUser} from '~/utils/account.server'
import {requireUserId} from '~/utils/auth.server'
import {requireEnabledMode} from '~/utils/mode.server'
import {listPaymentIntents} from '~/utils/payment-intent.server'
import {prisma} from '~/utils/prisma.server'
import {simulatePayment} from '~/utils/simulate-payment.server'

const schema = PaymentIntentSchema.pick({
  id: true,
})

export const meta: V2_MetaFunction = () => {
  return [{title: 'Payments'}]
}

export async function loader({request}: LoaderArgs) {
  const userId = await requireUserId(request)
  const account = await getAccountByUser(userId)
  const mode = await requireEnabledMode(request)

  const [paymentIntents, total] = await listPaymentIntents(account.id, mode)

  return typedjson({
    data: paymentIntents.map(pi => ({
      ...pi,
      tolerance: pi.tolerance.toNumber(),
    })),
    total,
  })
}

export async function action({request}: ActionArgs) {
  const userId = await requireUserId(request)
  const account = await getAccountByUser(userId)
  const mode = await requireEnabledMode(request)

  if (mode !== 'dev') {
    throw new Response(
      `You can not simulate a payment from a '${mode}' mode. Those payments rely on the blockchain to be confirmed.`,
      {
        status: 400,
        statusText: `You can not simulate a payment from a '${mode}' mode. Those payments rely on the blockchain to be confirmed.`,
      },
    )
  }

  // Validate the form submission
  const formData = await request.formData()
  const submission = await parse(formData, {
    async: true,
    schema,
  })

  if (!submission.value) {
    return json(
      {
        status: 'error',
        submission,
      } as const,
      {status: 400},
    )
  }

  // Retrieve the payment intent from the database
  const pi = await prisma.paymentIntent.findUnique({
    where: {
      id: submission.value.id,
      accountId: account.id,
    },
  })

  if (!pi) {
    return json(
      {
        status: 'error',
        submission,
      } as const,
      {status: 404},
    )
  }

  let result

  switch (submission.intent) {
    case 'pay-and-confirm':
      result = await simulatePayment(
        {
          idOrAddress: submission.value.id,
          accountId: account.id,
        },
        {
          // set the same values as the payment intent
          amount: pi.amount,
          currency: pi.currency,
          confirmations: pi.confirmations,
        },
      )
      break

    case 'pay-only':
      result = await simulatePayment(
        {
          idOrAddress: submission.value.id,
          accountId: account.id,
        },
        {
          // add a payment with 0 confirmations
          amount: pi.amount,
          currency: pi.currency,
          confirmations: 0,
        },
      )
      break

    default:
      return json({status: 'idle', submission} as const)
  }

  return typedjson({status: 'success', result} as const)
}

export default function PaymentsPage() {
  const {data} = useFreshData<typeof loader>()
  const navigate = useNavigate()
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Payments</h2>
        <div className="flex items-center space-x-2">
          {/* TODO: add date range for selecting */}
          {/* <CalendarDateRangePicker /> */}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data}
        onRowClick={row => navigate(`/payments/${row.id}`)}
      />
    </div>
  )
}
