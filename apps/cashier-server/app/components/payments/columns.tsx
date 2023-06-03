import type {PaymentIntent} from '@prisma/client'
import type {ColumnDef} from '@tanstack/react-table'

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
  },
  {
    accessorKey: 'createdAt',
    header: 'Created at',
  },
]
