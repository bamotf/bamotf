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
  Link,
  useActionData,
  useFormAction,
  useNavigation,
} from '@remix-run/react'

import {Button, ErrorList, Field, TextareaField} from '~/components/forms'
import {Icons} from '~/components/icons'
import {Button as UIButton} from '~/components/ui/button'
import {getAccountByUser} from '~/utils/account.server'
import {requireUserId} from '~/utils/auth.server'
import {createSecret} from '~/utils/encryption.server'
import {requireEnabledMode} from '~/utils/mode.server'
import {prisma} from '~/utils/prisma.server'
import {z} from '~/utils/zod'
import {StyledLink} from '../components/styled-link'

const schema = z.object({
  url: z.string().min(1, 'URL is required').url('URL is invalid'),
  // .startsWith('https://', 'URL must be "https://"'),
  description: z.string().optional(),
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
    throw new Response(`Cannot create webhooks in dev mode`, {
      status: 400,
      statusText: 'Cannot create webhooks in dev mode',
    })
  }

  // Validate the form submission
  const formData = await request.formData()
  const submission = await parse(formData, {
    async: true,
    schema: schema.superRefine(async ({url}, ctx) => {
      const alreadyExists = await prisma.webhook.findFirst({
        where: {
          url,
          accountId: account.id,
          mode,
        },
      })

      if (alreadyExists) {
        ctx.addIssue({
          path: ['url'],
          code: 'custom',
          message: 'Webhook endpoint already exists.',
        })
      }
    }),
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
  const {url, description} = submission.value

  const webhook = await prisma.webhook.create({
    data: {
      url,
      description,
      secret: createSecret(),
      accountId: account.id,
      mode,
    },
    select: {
      id: true,
    },
  })

  return redirect(`/webhooks/${webhook.id}`)
}

export default function WebhookCreatePage() {
  const lastSubmission = useActionData<typeof action>()

  const [form, fields] = useForm({
    id: 'create-webhook',
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
    <div className="hidden container relative h-[100dvh] flex-col justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="space-y-6 p-10">
        <div className="flex space-x-4 items-center">
          <UIButton variant="ghost" size="sm" asChild className="-ml-4 -mr-3">
            <Link to="/webhooks">
              <Icons.X className="h-4 w-4" />
            </Link>
          </UIButton>

          <div className="border-l h-4" />

          <span className="text-xs text-muted-foreground">
            Listen events from bamotf
          </span>
        </div>

        <div>
          <h3 className="text-2xl font-bold mb-2">Listen events from bamotf</h3>
          <p className="text-sm text-muted-foreground">
            Set up your webhook endpoint to receive production mode events from
            bamotf.
          </p>
        </div>

        <Separator />

        <Form method="POST" {...form.props}>
          <div className="space-y-8">
            <Field
              labelProps={{
                htmlFor: fields.url.id,
                children: 'URL endpoint',
              }}
              inputProps={{
                ...conform.input(fields.url),
                placeholder: 'https://',
              }}
              errors={fields.url.errors}
            />

            <TextareaField
              labelProps={{
                htmlFor: fields.description.id,
                children: 'Description',
              }}
              textareaProps={{
                ...conform.input(fields.description),
                placeholder:
                  'An optional description about the use of this webhook endpoint...',
              }}
              errors={fields.description.errors}
            />
          </div>

          <ErrorList errors={form.errors} id={form.errorId} />

          <div className="mt-8 space-x-2">
            <Button
              type="submit"
              status={
                isSubmitting ? 'pending' : lastSubmission?.status ?? 'idle'
              }
            >
              Create endpoint
            </Button>
            <UIButton variant="ghost" asChild>
              <Link to="/webhooks">Cancel</Link>
            </UIButton>
          </div>
        </Form>
      </div>

      <div className="relative hidden h-full flex-col bg-muted p-10 text-foreground dark:border-r lg:flex">
        <h3 className="text-base font-medium mb-2">Endpoint example</h3>
        <div className="">
          Checkout here the{' '}
          <StyledLink
            to="https://bamotf.com/docs/guides/webhooks"
            target="_blank"
          >
            webhook documentation
          </StyledLink>
        </div>
      </div>
    </div>
  )
}
