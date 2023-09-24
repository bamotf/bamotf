import {redirect, type LoaderArgs} from '@remix-run/node'
import {typedjson, useTypedLoaderData} from 'remix-typedjson'

import {Formatter} from '~/components/formatter'
import {Icons} from '~/components/icons'
import {Json} from '~/components/json'
import {StyledLink} from '~/components/styled-link'
import {Card} from '~/components/ui/card'
import {Separator} from '~/components/ui/separator'
import {WebhookBadge} from '~/components/webhook-badge'
import {getAccountByUser} from '~/utils/account.server'
import {requireUserId} from '~/utils/auth.server'
import {requireEnabledMode} from '~/utils/mode.server'
import {prisma} from '~/utils/prisma.server'

export async function loader({request, params}: LoaderArgs) {
  const userId = await requireUserId(request)
  const account = await getAccountByUser(userId)
  const mode = await requireEnabledMode(request)

  if (mode === 'dev') {
    throw redirect('/webhooks')
  }

  // Get the webhook for this route/account
  const webhook = await prisma.webhook.findUnique({
    where: {
      id: params.webhookId,
      accountId: account.id,
      mode,
    },
    select: {
      id: true,
      url: true,
      description: true,
      secret: true,
      version: true,
      attempts: {
        select: {
          id: true,
          event: true,
          body: true,
          response: true,
          status: true,
          url: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })

  if (!webhook) {
    throw new Response('', {
      status: 404,
      statusText: `Payment intent not found`,
    })
  }

  return typedjson(webhook)
}

// export async function action({request}: ActionArgs) {
//   const userId = await requireUserId(request)
//   const account = await getAccountByUser(userId)
// const mode = await requireEnabledMode(request)

//   const formData = await request.formData()

//   await prisma.webhook.delete({
//     where: {
//       id: formData.get('id') as string,
//       accountId: account.id,
//       mode,
//     },
//   })

//   return null
// }

export default function AllWebhooksPage() {
  const {id, url, secret, attempts, description} =
    useTypedLoaderData<typeof loader>()
  return (
    <>
      <div className="flex items-center justify-between text-muted-foreground">
        <h3 className="text-sm font-normal tracking-tight uppercase flex items-center  space-x-2">
          <Icons.Webhook className="inline w-4 mr-2" /> Webhooks
        </h3>
        <div className="flex items-center space-x-2">
          <span className="text-xs">{id}</span>
        </div>
      </div>

      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-semibold tracking-tight truncate">
          {url}
        </h2>
        <div className="flex items-center space-x-2">
          {/* TODO: dropdown with options to 
                    - update details
                    - renew secret
                    - delete webhook
         */}
        </div>
      </div>
      <span className="text-sm mt-2 text-muted-foreground">{description}</span>

      <Separator className="my-4" />

      <div className="flex h-10 items-center space-x-4 text-sm">
        <div className="space-y-2">
          <h4 className="text-sm font-light leading-none text-muted-foreground">
            Signature Secret
          </h4>
          <p className="text-sm text-foreground">{secret}</p>
        </div>
        {/* <Separator orientation="vertical" /> */}
      </div>

      <div className="space-y-4 pt-6 divide-y">
        {attempts.length > 0 ? (
          attempts.map(attempt => (
            <div key={attempt.id} className="grid gap-2 grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground">
                  <Formatter date={attempt.createdAt} />
                </p>
                <span>{attempt.url}</span>
                <p className="text-sm">{attempt.event}</p>
                <WebhookBadge status={attempt.status} />
              </div>

              <div className="flex flex-col">
                <div>Event data</div>
                <Json data={attempt.body} />
                <div>Response</div>
                <Json data={attempt.response} />
              </div>
            </div>
          ))
        ) : (
          <Card className="text-muted-foreground text-center p-10">
            <div className="font-medium mb-1">No attempts yet</div>
            Checkout here the{' '}
            <StyledLink
              to="https://bamotf.com/docs/guides/webhooks"
              target="_blank"
            >
              webhook documentation
            </StyledLink>
          </Card>
        )}
      </div>
    </>
  )
}
