import type {LoaderArgs, V2_MetaFunction} from '@remix-run/node'
import {useNavigate} from '@remix-run/react'
import {typedjson} from 'remix-typedjson'

import {DataTable} from '~/components/data-table'
import {CalendarDateRangePicker} from '~/components/date-range-picker'
import {columns} from '~/components/payments/columns'
import {useFreshData} from '~/hooks/use-fresh-data'
import {getAccountByUser} from '~/utils/account.server'
import {requireUserId} from '~/utils/auth.server'
import {listPaymentIntents} from '~/utils/payment-intent.server'

export const meta: V2_MetaFunction = () => {
  return [{title: 'Payments'}]
}

export async function loader({request}: LoaderArgs) {
  const userId = await requireUserId(request)
  const account = await getAccountByUser(userId)
  // FIX: this should be a query param
  const [paymentIntents, total] = await listPaymentIntents(account.id, 'DEV')

  return typedjson({
    data: paymentIntents.map(pi => ({
      ...pi,
      tolerance: pi.tolerance.toNumber(),
    })),
    total,
  })
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
