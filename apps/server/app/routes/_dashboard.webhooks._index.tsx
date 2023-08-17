import type {ActionArgs, LoaderArgs} from '@remix-run/node'
import {Link, useNavigate} from '@remix-run/react'
import {typedjson} from 'remix-typedjson'

import {DataTable} from '~/components/data-table'
import {Icons} from '~/components/icons'
import {Button} from '~/components/ui/button'
import {columns} from '~/components/webhooks/columns'
import {useFreshData} from '~/hooks/use-fresh-data'
import {getAccountByUser} from '~/utils/account.server'
import {requireUserId} from '~/utils/auth.server'
import {prisma} from '~/utils/prisma.server'

export async function loader({request}: LoaderArgs) {
  const userId = await requireUserId(request)
  const account = await getAccountByUser(userId)

  // Get all the webhooks for this account
  const webhooks = await prisma.webhook.findMany({
    where: {
      accountId: account.id,
      // FIX: should come from query param
      mode: 'DEV',
    },
    select: {
      id: true,
      url: true,
      // attempts: {
      //   where: {
      //     createdAt: {
      //       gt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // last 7 days
      //     },
      //   },
      //   select: {
      //     status: true,
      //   },
      // },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return typedjson({
    data: webhooks,
  })
}

export async function action({request}: ActionArgs) {
  const userId = await requireUserId(request)
  const account = await getAccountByUser(userId)

  const formData = await request.formData()

  await prisma.webhook.delete({
    where: {
      id: formData.get('id') as string,
      accountId: account.id,
      // FIX: should come from query param
      mode: 'DEV',
    },
  })

  return null
}

export default function AllWebhooksPage() {
  const {data} = useFreshData<typeof loader>()
  const navigate = useNavigate()
  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Webhooks</h2>
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline" asChild>
            <Link to="/webhooks/create">
              <Icons.Add className="mr-2 h-4 w-4" />
              Create endpoint
            </Link>
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data}
        onRowClick={row => navigate(`/webhooks/${row.id}`)}
      />
    </>
  )
}
