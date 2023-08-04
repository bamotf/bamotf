import {Form} from '@remix-run/react'
import type {ColumnDef} from '@tanstack/react-table'

import {Icons} from '../icons'
import {Button} from '../ui/button'

type Data = {
  id: string
  name: string
  createdAt: Date
}

export const columns: ColumnDef<Data>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
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
      if (row.original.name === 'Development API') return null

      return (
        <Form method="post" className="text-right">
          <input type="hidden" name="id" value={row.original.id} />
          <Button variant="ghost" className="h-8 w-8 p-0" type="submit">
            <span className="sr-only">Delete API</span>
            <Icons.Trash className="h-4 w-4" />
          </Button>
        </Form>
      )
    },
  },
]
