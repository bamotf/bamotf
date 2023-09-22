import {conform, useForm} from '@conform-to/react'
import {getFieldsetConstraint, parse} from '@conform-to/zod'
import {Separator} from '@radix-ui/react-select'
import {
  json,
  redirect,
  type DataFunctionArgs,
  type LoaderArgs,
} from '@remix-run/node'
import {
  Form,
  useActionData,
  useFormAction,
  useNavigation,
} from '@remix-run/react'

import {Button, ErrorList, Field} from '~/components/forms'
import {getAccountByUser} from '~/utils/account.server'
import {requireUserId} from '~/utils/auth.server'
import {createSecret} from '~/utils/encryption.server'
import {requireEnabledMode} from '~/utils/mode.server'
import {prisma} from '~/utils/prisma.server'
import {commitSession, getSession} from '~/utils/session.server'
import {z} from '~/utils/zod'

const schema = z.object({
  name: z.string().min(1, 'Name is required').min(3, 'Name is too short'),
})

export async function loader({request}: LoaderArgs) {
  const mode = await requireEnabledMode(request)

  if (mode === 'dev') {
    return redirect(`/apikeys`)
  }

  return null
}

export async function action({request}: DataFunctionArgs) {
  const userId = await requireUserId(request)
  const account = await getAccountByUser(userId)
  const mode = await requireEnabledMode(request)

  if (mode === 'dev') {
    throw new Response(`Cannot create API keys in dev mode`, {
      status: 400,
      statusText: 'Cannot create API keys in dev mode',
    })
  }

  // Validate the form submission
  const formData = await request.formData()
  const submission = await parse(formData, {
    async: true,
    schema,
  })

  if (submission.intent !== 'submit') {
    return json({status: 'idle', submission} as const)
  }
  if (!submission.value) {
    return json(
      {
        status: 'error',
        submission,
      } as const,
      {status: 400},
    )
  }

  // Form submission is valid, create the API key
  const {name} = submission.value

  const key = createSecret()
  await prisma.api.create({
    data: {
      name,
      key,
      accountId: account.id,
      mode,
    },
  })

  // Redirect to the API keys page with the new API key created in the session
  const session = await getSession(request.headers.get('Cookie'))
  session.flash('apikey', key)

  return redirect(`/apikeys`, {
    status: 302,
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  })
}

export default function ApiKeysCreatePage() {
  const lastSubmission = useActionData<typeof action>()

  const [form, fields] = useForm({
    id: 'create-apikey',
    constraint: getFieldsetConstraint(schema),
    lastSubmission: lastSubmission?.submission,
    onValidate({formData}) {
      return parse(formData, {schema})
    },
    shouldRevalidate: 'onBlur',
  })

  const navigation = useNavigation()
  const formAction = useFormAction()

  const isSubmitting =
    navigation.state === 'submitting' &&
    navigation.formAction === formAction &&
    navigation.formMethod === 'POST'

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">API Key</h3>
        <p className="text-sm text-muted-foreground">
          Create a new API Key to access your account.
        </p>
      </div>

      <Separator />

      <Form method="POST" {...form.props}>
        <div className="space-y-8">
          <Field
            labelProps={{
              htmlFor: fields.name.id,
              children: 'Name',
            }}
            description="Make sure to add some reference to where it is used."
            inputProps={conform.input(fields.name)}
            errors={fields.name.errors}
          />
        </div>

        <ErrorList errors={form.errors} id={form.errorId} />

        <div className="mt-8">
          <Button
            type="submit"
            status={isSubmitting ? 'pending' : lastSubmission?.status ?? 'idle'}
          >
            Create API Key
          </Button>
        </div>
      </Form>
    </div>
  )
}
