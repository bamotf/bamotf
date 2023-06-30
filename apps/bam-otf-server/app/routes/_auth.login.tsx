import {
  json,
  type DataFunctionArgs,
  type V2_MetaFunction,
} from '@remix-run/node'
import {useLoaderData, useSearchParams} from '@remix-run/react'

import {GeneralErrorBoundary} from '~/components/error-boundary'
import {Icons} from '~/components/icons'
import {authenticator, requireAnonymous} from '~/utils/auth.server'
import {commitSession, getSession} from '~/utils/session.server'
import {UserAuthForm} from './resources.login'

export async function loader({request}: DataFunctionArgs) {
  await requireAnonymous(request)
  const session = await getSession(request.headers.get('cookie'))
  const error = session.get(authenticator.sessionErrorKey)
  let errorMessage: string | null = null
  if (typeof error?.message === 'string') {
    errorMessage = error.message
  }
  return json(
    {formError: errorMessage},
    {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    },
  )
}

export const meta: V2_MetaFunction = () => {
  return [
    {title: 'Login'},
    {name: 'description', content: 'Login to your account'},
  ]
}

export default function LoginPage() {
  const [searchParams] = useSearchParams()
  const data = useLoaderData<typeof loader>()

  const redirectTo = searchParams.get('redirectTo') || '/'

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <Icons.Logo className="mx-auto mb-6" />
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your details to sign in to your account
          </p>
        </div>
        <UserAuthForm redirectTo={redirectTo} formError={data.formError} />
        {/* <p className="px-8 text-center text-sm text-muted-foreground">
          <Link
            to="/register"
            className="hover:text-brand underline underline-offset-4"
          >
            Don&apos;t have an account? Sign Up
          </Link>
        </p> */}
      </div>
    </div>
  )
}

export function ErrorBoundary() {
  return <GeneralErrorBoundary />
}
