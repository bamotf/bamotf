import type {PaymentIntent} from '@prisma/client'
import type {ColumnDef} from '@tanstack/react-table'

export const columns: ColumnDef<PaymentIntent>[] = [
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'address',
    header: 'Address',
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
  },
  {
    accessorKey: 'createdAt',
    header: 'Created at',
  },
]
