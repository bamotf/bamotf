import {useEffect, useState} from 'react'
import {currency} from '@bamotf/utils'
import {conform, useForm} from '@conform-to/react'
import {getFieldsetConstraint, parse} from '@conform-to/zod'
import {json, type ActionArgs} from '@remix-run/node'
import {Form, useActionData, useNavigation} from '@remix-run/react'

import {Button, ErrorList, Field} from '~/components/forms'
import {simulatePayment} from '~/utils/bitcoin-core'
import {env} from '~/utils/env.server'
import {z} from '~/utils/zod'

const schema = z.object({
  amount: z.coerce.number(),
  address: z.string().min(1, 'Address is required'),
})

export async function loader() {
  if (!env.DEV_MODE_ENABLED) {
    throw new Response('', {
      status: 404,
      statusText: `Page not found`,
    })
  }

  return null
}

export async function action({request}: ActionArgs) {
  const formData = await request.formData()
  const submission = parse(formData, {schema})

  if (!submission.value || submission.intent !== 'submit') {
    return json(submission, {status: 400})
  }

  await simulatePayment({
    address: submission.value.address,
    amount: currency.convertToBigInt({
      amount: submission.value.amount,
      currency: 'BTC',
    }),
  })

  return json(submission, {status: 200})
}

export default function SimulateForm({
  redirectTo,
  formError,
}: {
  redirectTo?: string
  formError?: string | null
}) {
  const [status, setStatus] = useState<
    'pending' | 'idle' | 'error' | 'success'
  >('idle')

  const lastSubmission = useActionData<typeof action>()

  const [form, fields] = useForm({
    id: 'inline-login',
    defaultValue: {redirectTo},
    constraint: getFieldsetConstraint(schema),
    lastSubmission,
    shouldRevalidate: 'onBlur',
  })

  const navigation = useNavigation()

  useEffect(() => {
    if (navigation.state === 'submitting') {
      setStatus('pending')
    }

    if (lastSubmission?.error) {
      setStatus('error')
    }

    if (lastSubmission?.value) {
      setStatus('success')
    }

    let timeout = setTimeout(() => {
      setStatus('idle')
    }, 3000)

    return () => {
      clearTimeout(timeout)
    }
  }, [navigation, lastSubmission])

  return (
    <div>
      <div className="mx-auto w-full max-w-md px-8">
        <h1 className="text-2xl font-bold mb-4">Simulate Payment</h1>
        <Form method="POST" {...form.props}>
          <Field
            className="mb-4"
            labelProps={{
              htmlFor: fields.address.id,
              children: 'Address',
            }}
            inputProps={{...conform.input(fields.address), autoFocus: true}}
            errors={fields.address.errors}
          />

          <Field
            className="mb-4"
            labelProps={{
              htmlFor: fields.amount.id,
              children: 'Amount',
            }}
            inputProps={conform.input(fields.amount)}
            errors={fields.amount.errors}
          />

          <ErrorList errors={[...form.errors, formError]} id={form.errorId} />

          <div className="flex items-center justify-between gap-6 pt-3">
            <Button
              className="w-full"
              status={status}
              type="submit"
              disabled={navigation.state !== 'idle'}
            >
              Pay
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}
