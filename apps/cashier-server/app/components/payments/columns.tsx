import type {PaymentIntent, PaymentIntentStatus} from '@prisma/client'
import {Link} from '@remix-run/react'
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

function LinkToItem({id, children}: {id: string; children: React.ReactNode}) {
  return (
    <Link to={`/payments/${id}`} className="hover:underline">
      {children}
    </Link>
  )
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
        <LinkToItem id={row.original.id}>
          <div
            className={cn(
              'text-right font-medium',
              status !== 'succeeded' && 'text-muted-foreground',
            )}
          >
            {formatted}
          </div>
        </LinkToItem>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({row}) => {
      const status = row.getValue('status') as PaymentIntent['status']

      return (
        <LinkToItem id={row.original.id}>
          <Badge status={status} />
        </LinkToItem>
      )
    },
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({row}) => (
      <LinkToItem id={row.original.id}>
        {row.getValue('description')}
      </LinkToItem>
    ),
  },
  {
    accessorKey: 'address',
    header: 'Address',
    cell: ({row}) => (
      <LinkToItem id={row.original.id}>{row.getValue('address')}</LinkToItem>
    ),
  },
  {
    accessorKey: 'currency',
    header: 'Currency',
    cell: ({row}) => (
      <LinkToItem id={row.original.id}>{row.getValue('currency')}</LinkToItem>
    ),
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
