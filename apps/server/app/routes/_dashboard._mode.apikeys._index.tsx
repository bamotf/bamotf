import type {ActionArgs, LoaderArgs} from '@remix-run/node'
import {Link} from '@remix-run/react'
import {typedjson} from 'remix-typedjson'

import {columns} from '~/components/apis/columns'
import {DataTable} from '~/components/data-table'
import {Icons} from '~/components/icons'
import {Alert, AlertDescription, AlertTitle} from '~/components/ui/alert'
import {Button} from '~/components/ui/button'
import {useFreshData} from '~/hooks/use-fresh-data'
import {getAccountByUser} from '~/utils/account.server'
import {requireUserId} from '~/utils/auth.server'
import {env} from '~/utils/env.server'
import {requireEnabledMode} from '~/utils/mode.server'
import {prisma} from '~/utils/prisma.server'
import {commitSession, getSession} from '~/utils/session.server'

export async function loader({request, params}: LoaderArgs) {
  const userId = await requireUserId(request)
  const account = await getAccountByUser(userId)
  const mode = await requireEnabledMode(request)

  if (mode === 'dev') {
    return typedjson({
      mode,
      devApiKey: env.DEV_API_KEY,
    })
  }

  // Get all the API keys for this account
  const apis = await prisma.api.findMany({
    where: {
      accountId: account.id,
      mode,
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
      mode,
      apis: apis,
      key: session.get('apikey') as string | undefined,
    },
    {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    },
  )
}

export async function action({request, params}: ActionArgs) {
  const userId = await requireUserId(request)
  const account = await getAccountByUser(userId)
  const mode = await requireEnabledMode(request)

  if (mode === 'dev') {
    throw new Response(`Cannot delete API keys in dev mode`, {
      status: 400,
      statusText: 'Cannot delete API keys in dev mode',
    })
  }

  const formData = await request.formData()
  await prisma.api.delete({
    where: {
      id: formData.get('id') as string,
      accountId: account.id,
      mode,
    },
  })

  return null
}

export default function AllApiKeysPage() {
  const data = useFreshData<typeof loader>()

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">API Keys</h2>

        {data.mode !== 'dev' && (
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline" asChild>
              <Link to="/apikeys/create">
                <Icons.Add className="mr-2 h-4 w-4" />
                Create API Key
              </Link>
            </Button>
          </div>
        )}
      </div>

      {data.mode === 'dev' ? (
        <Alert>
          <Icons.CheckCircle className="h-4 w-4" />
          <AlertTitle>
            Using the dev API key{' '}
            <code className="font-mono font-semibold">{data.devApiKey}</code>
          </AlertTitle>
          <AlertDescription>
            This key is used for local development and is usually set in your{' '}
            <code className="font-mono">.env</code> file.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-3">
          {data.key && (
            // TODO: Make sure the copy aligns with github PTA
            <Alert>
              <Icons.CheckCircle className="h-4 w-4" />
              <AlertTitle>
                API key{' '}
                <code className="font-mono font-semibold">{data.key}</code>{' '}
                created
              </AlertTitle>
              <AlertDescription>
                This key is only shown once, so make sure to copy it somewhere
                safe.
              </AlertDescription>
            </Alert>
          )}

          <DataTable columns={columns} data={data.apis} />
        </div>
      )}
    </>
  )
}
