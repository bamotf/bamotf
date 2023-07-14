import {conform, useForm} from '@conform-to/react'
import {getFieldsetConstraint, parse} from '@conform-to/zod'
import {
  json,
  redirect,
  type DataFunctionArgs,
  type V2_MetaFunction,
} from '@remix-run/node'
import {
  Form,
  useActionData,
  useFormAction,
  useLoaderData,
  useNavigation,
} from '@remix-run/react'
import {z} from 'zod'

import {Button, ErrorList, Field} from '~/components/forms'
import {Separator} from '~/components/ui/separator'
import type {loader as rootLoader} from '~/root'
import {nameSchema, passwordSchema, usernameSchema} from '~/schemas'
import {
  authenticator,
  getPasswordHash,
  requireUserId,
  verifyLogin,
} from '~/utils/auth.server'
import {prisma} from '~/utils/prisma.server'

const profileFormSchema = z.object({
  name: nameSchema.optional(),
  username: usernameSchema,
  currentPassword: z
    .union([passwordSchema, z.string().min(0).max(0)])
    .optional(),
  newPassword: z.union([passwordSchema, z.string().min(0).max(0)]).optional(),
})

export const meta: V2_MetaFunction<
  undefined,
  {
    root: typeof rootLoader
  }
> = ({params, data, matches}) => {
  const root = matches.find(m => m.id === 'root')
  return [{title: `Settings - ${root?.data.user?.username}`}]
}

export async function loader({request}: DataFunctionArgs) {
  const userId = await requireUserId(request)
  const user = await prisma.user.findUnique({
    where: {id: userId},
    select: {
      id: true,
      name: true,
      username: true,
    },
  })

  if (!user) {
    throw await authenticator.logout(request, {redirectTo: '/'})
  }
  return json({user})
}

export async function action({request}: DataFunctionArgs) {
  const userId = await requireUserId(request)
  const formData = await request.formData()
  const submission = await parse(formData, {
    async: true,
    schema: profileFormSchema.superRefine(
      async ({username, currentPassword, newPassword}, ctx) => {
        if (newPassword && !currentPassword) {
          ctx.addIssue({
            path: ['currentPassword'],
            code: 'custom',
            message: 'Must provide current password to change password.',
          })
        }
        if (!newPassword && currentPassword) {
          ctx.addIssue({
            path: ['newPassword'],
            code: 'custom',
            message: 'Must provide a new password to change password.',
          })
        }
        if (currentPassword && newPassword) {
          const user = await verifyLogin(username, currentPassword)
          if (!user) {
            ctx.addIssue({
              path: ['currentPassword'],
              code: 'custom',
              message: 'Incorrect password.',
            })
          }
        }
      },
    ),
    acceptMultipleErrors: () => true,
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
  const {name, username, newPassword} = submission.value

  const updatedUser = await prisma.user.update({
    select: {id: true, username: true},
    where: {id: userId},
    data: {
      name,
      username,
      password: newPassword
        ? {
            update: {
              hash: await getPasswordHash(newPassword),
            },
          }
        : undefined,
    },
  })

  return redirect(`/settings`, {status: 302})
}

export default function EditUserProfile() {
  const data = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()
  const navigation = useNavigation()
  const formAction = useFormAction()

  const isSubmitting =
    navigation.state === 'submitting' &&
    navigation.formAction === formAction &&
    navigation.formMethod === 'POST'

  const [form, fields] = useForm({
    id: 'edit-profile',
    constraint: getFieldsetConstraint(profileFormSchema),
    lastSubmission: actionData?.submission,
    onValidate({formData}) {
      return parse(formData, {schema: profileFormSchema})
    },
    defaultValue: {
      username: data.user.username,
      name: data.user.name ?? '',
    },
    shouldRevalidate: 'onBlur',
  })

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Account</h3>
        <p className="text-sm text-muted-foreground">
          Update your account settings.
        </p>
      </div>

      <Separator />

      <Form method="POST" {...form.props}>
        <div className="space-y-8">
          <Field
            labelProps={{
              htmlFor: fields.username.id,
              children: 'Username',
            }}
            description="Your username is how you'll be identified on the site."
            inputProps={conform.input(fields.username)}
            errors={fields.username.errors}
          />
          <Field
            labelProps={{htmlFor: fields.name.id, children: 'Name'}}
            inputProps={conform.input(fields.name)}
            description="This is the name that will be displayed on your profile."
            errors={fields.name.errors}
          />

          <Separator />
          <fieldset className="col-span-6">
            <legend className="pb-6 text-lg text-night-200">
              Change password
            </legend>
            <div className="flex justify-between gap-10">
              <Field
                className="flex-1"
                labelProps={{
                  htmlFor: fields.currentPassword.id,
                  children: 'Current Password',
                }}
                inputProps={{
                  ...conform.input(fields.currentPassword, {
                    type: 'password',
                  }),
                  autoComplete: 'current-password',
                }}
                errors={fields.currentPassword.errors}
              />
              <Field
                className="flex-1"
                labelProps={{
                  htmlFor: fields.newPassword.id,
                  children: 'New Password',
                }}
                inputProps={{
                  ...conform.input(fields.newPassword, {type: 'password'}),
                  autoComplete: 'new-password',
                }}
                errors={fields.newPassword.errors}
              />
            </div>
          </fieldset>
        </div>

        <ErrorList errors={form.errors} id={form.errorId} />

        <div className="mt-8">
          <Button
            type="submit"
            status={isSubmitting ? 'pending' : actionData?.status ?? 'idle'}
          >
            Update account
          </Button>
        </div>
      </Form>
    </div>
  )
}
