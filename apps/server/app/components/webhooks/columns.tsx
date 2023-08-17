import type {ColumnDef} from '@tanstack/react-table'

type Data = {
  id: string
  url: string
}

export const columns: ColumnDef<Data>[] = [
  {
    accessorKey: 'url',
    header: 'URL',
  },
]
