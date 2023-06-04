import type {PaymentIntent, PaymentIntentStatus} from '@prisma/client'
import type {ColumnDef} from '@tanstack/react-table'
import {Badge} from '~/components/payments/badge'
import {useFormattedAmount} from '~/hooks/use-formatted-amount'
import {cn} from '~/utils/css'

type Data = {
  id: string
  amount: number
  address: string
  status: PaymentIntentStatus
  currency: string
  description: string | null
  createdAt: Date
}

export const columns: ColumnDef<Data>[] = [
  {
    accessorKey: 'amount',
    header: () => <div className="text-right">Amount</div>,
    cell: ({row, getValue}) => {
      const amount = parseFloat(row.getValue('amount'))

      // eslint-disable-next-line react-hooks/rules-of-hooks
      const formatted = useFormattedAmount({
        amount,
        currency: row.getValue('currency'),
      })
      const status = row.getValue('status') as PaymentIntent['status']

      return (
        <div
          className={cn(
            'text-right font-medium',
            status !== 'succeeded' && 'text-muted-foreground',
          )}
        >
          {formatted}
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({row}) => {
      const status = row.getValue('status') as PaymentIntent['status']

      return <Badge status={status} />
    },
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'address',
    header: 'Address',
  },
  {
    accessorKey: 'currency',
    header: 'Currency',
    enableHiding: true,
  },
  {
    accessorKey: 'createdAt',
    header: 'Created at',
    cell: ({row}) => {
      const date = new Date(row.getValue('createdAt'))
      // format like `18 de mai. 20:38`
      const formatted = new Intl.DateTimeFormat('en-US', {
        day: 'numeric',
        month: 'short',
        hour: 'numeric',
        minute: 'numeric',
      }).format(date)

      return formatted
    },
  },
]
