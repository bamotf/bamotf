import type {PaymentIntent} from '@prisma/client'
import type {ColumnDef} from '@tanstack/react-table'
import {Badge} from '~/components/payments/badge'
import {cn} from '~/utils/css'

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
        .replace(/^(\D+)/, '$1 ')
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
