import type {ActionArgs, LoaderArgs} from '@remix-run/node'
import {Link} from '@remix-run/react'
import {typedjson} from 'remix-typedjson'

import {columns} from '~/components/apis/columns'
import {DataTable} from '~/components/data-table'
import {Icons} from '~/components/icons'
import {Button} from '~/components/ui/button'
import {useFreshData} from '~/hooks/use-fresh-data'
import {getAccountByUser} from '~/utils/account.server'
import {requireUserId} from '~/utils/auth.server'
import {prisma} from '~/utils/prisma.server'
import {commitSession, getSession} from '~/utils/session.server'

export async function loader({request}: LoaderArgs) {
  const userId = await requireUserId(request)
  const account = await getAccountByUser(userId)

  // Get all the API keys for this account
  const apis = await prisma.api.findMany({
    where: {
      accountId: account.id,
      // FIX: should come from query param
      mode: 'DEV',
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  // Checks if there is a key in the session, if so,
  const session = await getSession(request.headers.get('Cookie'))

  return typedjson(
    {
      data: apis,
      key: session.get('apikey') as string | undefined,
    },
    {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    },
  )
}

export async function action({request}: ActionArgs) {
  const userId = await requireUserId(request)
  const account = await getAccountByUser(userId)

  const formData = await request.formData()
  console.log('🔥 ~ ')
  await prisma.api.delete({
    where: {
      id: formData.get('id') as string,
      accountId: account.id,
      // FIX: should come from query param
      mode: 'DEV',
    },
  })

  return null
}

export default function AllApiKeysPage() {
  const {data, key} = useFreshData<typeof loader>()
  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">API Keys</h2>
        <div className="flex items-center space-x-2">
          <Button size="sm" asChild>
            <Link to="/apikeys/create">
              <Icons.Add className="mr-2 h-4 w-4" />
              Create API Key
            </Link>
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {key && (
          // TODO: created by copilot, should be styled using the foreground/background color from the theme
          <div className="bg-green-50 border-l-4 border-green-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <Icons.CheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm leading-5 text-green-800">
                  API key <code className="font-mono font-semibold">{key}</code>{' '}
                  created
                </p>
              </div>
            </div>
          </div>
        )}

        <DataTable columns={columns} data={data} />
      </div>
    </>
  )
}
