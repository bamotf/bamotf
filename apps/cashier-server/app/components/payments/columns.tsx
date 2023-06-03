import type {PaymentIntent} from '@prisma/client'
import type {ColumnDef} from '@tanstack/react-table'
import {Badge} from '~/components/payments/badge'

export const columns: ColumnDef<PaymentIntent>[] = [
  {
    accessorKey: 'amount',
    header: () => <div className="text-right">Amount</div>,
    cell: ({row}) => {
      const amount = parseFloat(row.getValue('amount'))
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumSignificantDigits: 8,
        // minimumSignificantDigits: 0,
      })
        .format(amount * 1e-8)
        .replace('$', '₿')

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: 'address',
    header: 'Address',
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
