import type {LoaderArgs, V2_MetaFunction} from '@remix-run/node'
import {redirect} from '@remix-run/router'
import {typedjson} from 'remix-typedjson'

import {Formatter} from '~/components/formatter'
import {Icons} from '~/components/icons'
import {Json} from '~/components/json'
import {Badge} from '~/components/payments/badge'
import {Badge as BaseBadge} from '~/components/ui/badge'
import {Separator} from '~/components/ui/separator'
import {useFreshData} from '~/hooks/use-fresh-data'
import {PaymentIntentSchema} from '~/schemas'
import {getAccountByUser} from '~/utils/account.server'
import {requireUserId} from '~/utils/auth.server'
import {createContract} from '~/utils/contract'
import {cn} from '~/utils/css'
import {requireEnabledMode} from '~/utils/mode.server'
import {prisma, type LogType} from '~/utils/prisma.server'
import {calculateRiskScore} from '~/utils/risk-score'
import type {CurrencyCode} from '../../../../config/currency'
import {WebhookBadge} from '../components/webhook-badge'

export const meta: V2_MetaFunction = ({params, data}) => {
  return [{title: `Payment ${params.id}`}]
}

export const contract = createContract({
  loader: {
    pathParams: PaymentIntentSchema.pick({id: true}),
  },
})

/**
 * Retrieves a PaymentIntent object.
 */
export async function loader({params, request}: LoaderArgs) {
  const userId = await requireUserId(request)
  const account = await getAccountByUser(userId)
  const mode = await requireEnabledMode(request)

  const {path} = await contract.loader({params})

  const {id} = path

  const paymentIntent = await prisma.paymentIntent.findUnique({
    where: {
      id,
      accountId: account.id,
    },
    include: {
      transactions: true,
      webhookAttempts: true,
      logs: {
        orderBy: {createdAt: 'desc'},
      },
    },
  })

  if (!paymentIntent) {
    throw new Response('', {
      status: 404,
      statusText: `Payment intent not found`,
    })
  }

  if (paymentIntent.mode !== mode) {
    throw redirect('/payments')
  }

  const riskScore = await calculateRiskScore({
    amount: paymentIntent.amount,
    confirmations: paymentIntent.confirmations,
    currency: paymentIntent.currency as CurrencyCode,
    transactions: paymentIntent.transactions,
  })

  return typedjson({
    ...paymentIntent,
    tolerance: paymentIntent.tolerance.toNumber(),
    riskScore,
  })
}

export default function PaymentsPage() {
  const {
    id,
    amount,
    currency,
    status,
    updatedAt,
    address,
    metadata,
    tolerance,
    canceledAt,
    cancellationReason,
    confirmations,
    description,
    logs,
    transactions,
    riskScore,
    webhookAttempts,
  } = useFreshData<typeof loader>()

  return (
    <div className="flex-1 space-y-12 p-8 pt-6">
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between text-muted-foreground">
          <h3 className="text-sm font-normal tracking-tight uppercase flex items-center  space-x-2">
            <Icons.Billing className="inline w-4 mr-2" /> Payment
          </h3>
          <div className="flex items-center space-x-2">
            <span className="text-xs">{id}</span>
          </div>
        </div>
        <div className="flex items-center justify-between space-y-2">
          <div className="flex items-center">
            <h2 className="text-3xl font-semibold tracking-tight">
              <Formatter amount={amount} currency={currency} />
            </h2>
            <h3 className="text-3xl font-light tracking-tight text-muted-foreground ml-1.5">
              {currency}
            </h3>
            <Badge status={status} className="ml-3" />
          </div>
          <div className="flex items-center space-x-2"></div>
        </div>
        <SectionSeparator />
        <div className="flex h-10 items-center space-x-4 text-sm">
          <div className="space-y-2">
            <h4 className="text-sm font-light leading-none text-muted-foreground">
              Last update
            </h4>
            <p className="text-sm text-foreground">
              <Formatter date={updatedAt} />
            </p>
          </div>
          <Separator orientation="vertical" />
          <div className="space-y-2">
            <h4 className="text-sm font-light leading-none text-muted-foreground">
              Address
            </h4>
            <p className="text-sm text-foreground">{address}</p>
          </div>
          <Separator orientation="vertical" />
          <div className="space-y-2">
            <h4 className="text-sm font-light leading-none text-muted-foreground">
              Risk analysis
            </h4>
            {/* 
              https://bitcoin.org/en/you-need-to-know
              Confirmations	Lightweight wallets	Bitcoin Core
              0	Only safe if you trust the person paying you
              1	Mostly reliable
              3	Highly reliable
              6	Minimum recommendation for high-value bitcoin transfers
              30	Recommendation during emergencies to allow human intervention
            */}
            <div className="text-sm text-foreground">
              <RiskScore score={riskScore} />
            </div>
          </div>
        </div>
      </div>

      <div>
        <SectionHeader>Timeline</SectionHeader>
        <SectionSeparator />
        <div className="flex flex-col gap-4">
          {logs.map(log => (
            <LogItem key={log.id} {...log} />
          ))}
        </div>
      </div>

      <div>
        <SectionHeader>Payment details</SectionHeader>
        <SectionSeparator />
        <Grid>
          <GridLine>
            <ColumnDetail>Amount</ColumnDetail>
            <ColumnValue>
              <Formatter amount={amount} currency={currency} />
            </ColumnValue>
          </GridLine>

          <GridLine>
            <ColumnDetail>Status</ColumnDetail>
            <ColumnValue>
              <span className="capitalize">{status}</span>
            </ColumnValue>
          </GridLine>

          {currency !== 'BTC' && (
            <GridLine>
              <ColumnDetail>Tolerance</ColumnDetail>
              <ColumnValue>{tolerance * 100}%</ColumnValue>
            </GridLine>
          )}
          <GridLine>
            <ColumnDetail>Block confirmations</ColumnDetail>
            <ColumnValue>{confirmations}</ColumnValue>
          </GridLine>

          {status === 'canceled' && (
            <>
              <GridLine>
                <ColumnDetail>Canceled at</ColumnDetail>
                <ColumnValue>
                  <Formatter date={canceledAt!} />
                </ColumnValue>
              </GridLine>
              <GridLine>
                <ColumnDetail>Cancellation reason</ColumnDetail>
                <ColumnValue>{cancellationReason}</ColumnValue>
              </GridLine>
            </>
          )}

          {description && (
            <GridLine>
              <ColumnDetail>Description</ColumnDetail>
              <ColumnValue>{description}</ColumnValue>
            </GridLine>
          )}
        </Grid>
      </div>

      <div>
        <SectionHeader>Metadata</SectionHeader>
        <SectionSeparator />
        {metadata ? (
          <Grid>
            {Object.entries(metadata).map(([key, value]) => (
              <GridLine key={key}>
                <ColumnDetail>{key}</ColumnDetail>
                <ColumnValue>{value}</ColumnValue>
              </GridLine>
            ))}
          </Grid>
        ) : (
          <div className="h-24 text-center flex items-center justify-center">
            No results.
          </div>
        )}
      </div>

      <div>
        <SectionHeader>Logs and events</SectionHeader>
        <SectionSeparator />
        {webhookAttempts.length ? (
          <div>
            {webhookAttempts.map(attempt => (
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
            ))}
          </div>
        ) : (
          <div className="h-24 text-center flex items-center justify-center">
            No results.
          </div>
        )}
      </div>
    </div>
  )
}

function LogItem({
  status,
  message: originalMessage,
  createdAt,
}: {
  status: LogType
  message: string | null
  createdAt: Date
}) {
  const messages: Record<LogType, string> = {
    modified: 'Payment modified',
    note: originalMessage || '',
    status_canceled: 'Payment canceled',
    status_created: 'Payment initiated',
    status_processing: 'A transaction is detected on the blockchain',
    status_succeeded: 'Payment confirmed',
  }

  const message = messages[status]

  return (
    <div className="flex">
      <div className="flex relative gap-2">
        <Icons.Clock className="w-3 h-3 -ml-1 mt-1 text-muted-foreground" />
        <div className="flex flex-col">
          <span className="text-sm">{message}</span>
          <span className="text-xs text-muted-foreground">
            <Formatter date={createdAt} />
          </span>
        </div>
      </div>
    </div>
  )
}

function SectionSeparator() {
  return <Separator className="my-4" />
}

function SectionHeader(props: {children: React.ReactNode}) {
  return <h4 className="text-xl font-bold leading-7" {...props} />
}

function Grid(props: {children: React.ReactNode}) {
  return <div className="flex flex-col flex-wrap" {...props} />
}

function GridLine(props: {children: React.ReactNode}) {
  return <div className="py-0.5 flex gap-2" {...props} />
}

function ColumnDetail(props: {children: React.ReactNode}) {
  return (
    <span
      className="text-sm font-light text-muted-foreground min-w-[180px] max-w-[240px]"
      {...props}
    />
  )
}

function ColumnValue(props: {children: React.ReactNode}) {
  return <span className="text-sm text-foreground" {...props} />
}

function RiskScore({score}: {score: number}) {
  const MAX_SCORE = 100
  const COLORS = [
    'text-success bg-success/10 hover:bg-success/5',
    'text-warning bg-warning/10 hover:bg-warning/5',
    'text-destructive bg-destructive/10 hover:bg-destructive/5',
  ]
  const DESCRIPTIONS = [
    'Low risk',
    'Medium risk',
    'High risk',
    'Very high risk',
  ]

  const color = COLORS[Math.floor((score / MAX_SCORE) * COLORS.length)]
  const description =
    DESCRIPTIONS[Math.floor((score / MAX_SCORE) * DESCRIPTIONS.length)]

  return (
    <div className="flex items-center">
      <BaseBadge className={cn(color, 'text-xs')}>{score}</BaseBadge>
      <div className="ml-2">{description}</div>
    </div>
  )
}
