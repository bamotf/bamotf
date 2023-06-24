import type {LoaderArgs, V2_MetaFunction} from '@remix-run/node'
import {typedjson} from 'remix-typedjson'

import {CalendarDateRangePicker} from '~/components/date-range-picker'
import {columns} from '~/components/payments/columns'
import {DataTable} from '~/components/payments/data-table'
import {useFreshData} from '~/hooks/use-fresh-data'
import {requireUserId} from '~/utils/auth.server'
import {listPaymentIntents} from './api.payment-intents._index'

export const meta: V2_MetaFunction = () => {
  return [{title: 'Payments'}]
}

export async function loader({request}: LoaderArgs) {
  await requireUserId(request)
  const [paymentIntents, total] = await listPaymentIntents()

  return typedjson({
    data: paymentIntents.map(pi => ({
      ...pi,
      amount: pi.amount.toNumber(),
      tolerance: pi.tolerance.toNumber(),
    })),
    total,
  })
}

export default function PaymentsPage() {
  const {data} = useFreshData<typeof loader>()

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Payments</h2>
        <div className="flex items-center space-x-2">
          {/* TODO: add date range for selecting */}
          {/* <CalendarDateRangePicker /> */}
        </div>
      </div>

      <DataTable columns={columns} data={data} />
    </div>
  )
}
