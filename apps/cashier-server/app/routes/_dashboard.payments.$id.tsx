import type {LoaderArgs, V2_MetaFunction} from '@remix-run/node'
import {typedjson} from 'remix-typedjson'

import {Formatter} from '~/components/formatter'
import {Icons} from '~/components/icons'
import {Badge} from '~/components/payments/badge'
import {Badge as BaseBadge} from '~/components/ui/badge'
import {Separator} from '~/components/ui/separator'
import {useFreshData} from '~/hooks/use-fresh-data'
import {PaymentIntentSchema} from '~/schemas'
import {createContract} from '~/utils/contract'
import {prisma} from '~/utils/prisma.server'

import JSONPretty from 'react-json-pretty'
// @ts-ignore
import '~/components/json.css'
import {cn} from '~/utils/css'

export const meta: V2_MetaFunction = ({params, data}) => {
  return [{title: 'Payment'}]
}

export const contract = createContract({
  loader: {
    pathParams: PaymentIntentSchema.pick({id: true}),
  },
})

/**
 * Retrieves a PaymentIntent object.
 */
export async function loader({params}: LoaderArgs) {
  const {path} = await contract.loader({params})

  const {id} = path

  const paymentIntent = await prisma.paymentIntent.findUniqueOrThrow({
    where: {id},
    include: {
      transactions: true,
      webhookAttempts: true,
    },
  })

  return typedjson({
    ...paymentIntent,
    amount: paymentIntent.amount.toNumber(),
    tolerance: paymentIntent.tolerance.toNumber(),
    transactions: paymentIntent.transactions.map(transaction => ({
      ...transaction,
      amount: transaction.amount.toNumber(),
      originalAmount: transaction.originalAmount?.toNumber(),
    })),
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
    createdAt,
    description,
    transactions,
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
          <div className="space-y-1">
            <h4 className="text-sm font-light leading-none text-muted-foreground">
              Last update
            </h4>
            <p className="text-sm text-foreground">
              {updatedAt.toLocaleString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
              })}
            </p>
          </div>
          <Separator orientation="vertical" />
          <div className="space-y-1">
            <h4 className="text-sm font-light leading-none text-muted-foreground">
              Address
            </h4>
            <p className="text-sm text-foreground">{address}</p>
          </div>
        </div>
      </div>

      <div className="">
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
                  {canceledAt!.toLocaleString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                  })}
                </ColumnValue>
              </GridLine>
              <GridLine>
                <ColumnDetail>Cancellation reason</ColumnDetail>
                <ColumnValue>{cancellationReason}</ColumnValue>
              </GridLine>
            </>
          )}
          <GridLine>
            <ColumnDetail>Created at</ColumnDetail>
            <ColumnValue>
              {createdAt.toLocaleString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
              })}
            </ColumnValue>
          </GridLine>
          <GridLine>
            <ColumnDetail>Description</ColumnDetail>
            <ColumnValue>{description}</ColumnValue>
          </GridLine>
        </Grid>
      </div>

      <div className="">
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

      <div className="">
        <SectionHeader>Logs and events</SectionHeader>
        <SectionSeparator />
        {webhookAttempts.length ? (
          <div>
            {webhookAttempts.map(attempt => (
              <div key={attempt.id} className="flex gap-2 justify-between">
                <div className="">
                  <p className="text-xs text-muted-foreground">
                    {attempt.createdAt.toLocaleString('en-US', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                    })}
                  </p>
                  <span className="">{attempt.url}</span>
                  <p className="text-sm">{attempt.event}</p>
                  <WebhookBadge status={attempt.status} />
                </div>

                <div className="flex flex-col">
                  <div className="">Event data</div>
                  <JSONPretty
                    id="json-pretty"
                    data={attempt.body}
                    className="font-light text-xs"
                  ></JSONPretty>
                  <div className="">Response</div>
                  <JSONPretty
                    id="json-pretty"
                    data={attempt.response}
                    className="font-light text-xs"
                  ></JSONPretty>
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

function WebhookBadge({status}: {status: number}) {
  return (
    <BaseBadge
      className={cn({
        'bg-green-100 text-green-900 hover:bg-green-100/80':
          status > 200 && status < 300,
        'bg-gray-100 text-gray-900 hover:bg-gray-100/80':
          status >= 300 && status < 500,
        'bg-red-100 text-red-900 hover:bg-red-100/80': status >= 500,
      })}
    >
      {status}
    </BaseBadge>
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
      className="text-sm text-muted-foreground min-w-[180px] max-w-[240px]"
      {...props}
    />
  )
}

function ColumnValue(props: {children: React.ReactNode}) {
  return <span className="text-sm text-foreground" {...props} />
}
