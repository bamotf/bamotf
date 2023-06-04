import type {LoaderArgs, V2_MetaFunction} from '@remix-run/node'
import {typedjson} from 'remix-typedjson'

import {CalendarDateRangePicker} from '~/components/date-range-picker'
import {columns} from '~/components/payments/columns'
import {DataTable} from '~/components/payments/data-table'
import {useFreshData} from '~/hooks/use-fresh-data'
import {prisma} from '~/utils/prisma.server'

export const meta: V2_MetaFunction = () => {
  return [{title: 'Payments'}]
}

export async function loader({params, request}: LoaderArgs) {
  const paymentIntents = await prisma.paymentIntent.findMany({
    include: {transactions: true},
    orderBy: {createdAt: 'desc'},
  })
  return typedjson({data: paymentIntents})
}

export default function PaymentsPage() {
  const {data} = useFreshData<typeof loader>()

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Payments</h2>
        <div className="flex items-center space-x-2">
          <CalendarDateRangePicker />
        </div>
      </div>

      <DataTable columns={columns} data={data} />
    </div>
  )
}
