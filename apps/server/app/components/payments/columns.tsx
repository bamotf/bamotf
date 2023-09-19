import {conform} from '@conform-to/react'
import {Link, useFetcher} from '@remix-run/react'
import type {ColumnDef} from '@tanstack/react-table'

import {Formatter} from '~/components/formatter'
import {Icons} from '~/components/icons'
import {Badge} from '~/components/payments/badge'
import {Button} from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import {cn} from '~/utils/css'
import type {PaymentIntent} from '~/utils/prisma.server'

type Data = Pick<
  PaymentIntent,
  | 'id'
  | 'mode'
  | 'amount'
  | 'address'
  | 'status'
  | 'currency'
  | 'description'
  | 'confirmations'
  | 'createdAt'
>

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
      return (
        <LinkToItem id={row.original.id}>
          <div
            className={cn(
              'text-right font-medium',
              row.original.status !== 'succeeded' && 'text-muted-foreground',
            )}
          >
            <Formatter
              amount={row.original.amount}
              currency={row.original.currency}
            />
          </div>
        </LinkToItem>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({row}) => {
      return (
        <LinkToItem id={row.original.id}>
          <Badge status={row.original.status} />
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
  {
    id: 'actions',
    enableHiding: false,
    cell: ({row}) => {
      const pi = row.original
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const fetcher = useFetcher()

      // submit form programmatically
      const handleSubmit = (intent: string) => {
        fetcher.submit(
          {
            id: pi.id,
            [conform.INTENT]: intent,
          },
          {method: 'post'},
        )
      }

      return (
        <fetcher.Form method="post" onClick={e => e.stopPropagation()}>
          <input type="hidden" name="id" value={pi.id} />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <Icons.More className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(pi.id)}
              >
                Copy payment ID
              </DropdownMenuItem>
              {pi.mode === 'dev' &&
                ['pending', 'processing'].includes(pi.status) && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Simulate</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => handleSubmit('pay-and-confirm')}
                    >
                      <Icons.CheckCheck className="mr-2 h-4 w-4 text-success" />
                      <span>Pay and confirm</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSubmit('pay-only')}>
                      <Icons.Check className="mr-2 h-4 w-4 text-warning" />
                      <span>Pay only</span>
                    </DropdownMenuItem>
                  </>
                )}
            </DropdownMenuContent>
          </DropdownMenu>
        </fetcher.Form>
      )
    },
  },
]
