import type {PropsWithChildren} from 'react'
import {cssBundleHref} from '@remix-run/css-bundle'
import {
  json,
  type LinksFunction,
  type LoaderArgs,
  type SerializeFrom,
} from '@remix-run/node'
import {
  isRouteErrorResponse,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from '@remix-run/react'

import {prisma} from '~/utils/prisma.server'
import {TailwindIndicator} from './components/tailwind-indicator'
import {authenticator, getUserId} from './utils/auth.server'

import './globals.css'

const fontStylestylesheetUrl = 'https://rsms.me/inter/inter.css'

export const links: LinksFunction = () => [
  // Preload CSS as a resource to avoid render blocking
  {rel: 'preload', href: fontStylestylesheetUrl, as: 'style'},
  ...(cssBundleHref
    ? [{rel: 'preload', href: cssBundleHref, as: 'style'}]
    : []),
  {rel: 'stylesheet', href: fontStylestylesheetUrl},
  ...(cssBundleHref ? [{rel: 'stylesheet', href: cssBundleHref}] : []),
]

export async function loader({request}: LoaderArgs) {
  const userId = await getUserId(request)

  const user = userId
    ? await prisma.user.findUnique({
        where: {id: userId},
        select: {id: true, name: true, username: true},
      })
    : null
  if (userId && !user) {
    console.info('something weird happened')
    // something weird happened... The user is authenticated but we can't find
    // them in the database. Maybe they were deleted? Let's log them out.
    await authenticator.logout(request, {redirectTo: '/'})
  }

  return json({
    user,
    ENV: {},
  })
}

declare global {
  interface Window {
    ENV: SerializeFrom<typeof loader>['ENV']
  }
}

export default function App() {
  const data = useLoaderData<typeof loader>()

  return (
    <Document>
      <Outlet />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
        }}
      />
    </Document>
  )
}

function Document({children}: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <TailwindIndicator />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()

  // when true, this is what used to go to `CatchBoundary`
  if (isRouteErrorResponse(error)) {
    return (
      <Document>
        <h1>Oops</h1>
        <p>Status: {error.status}</p>
        <p>{error.data.message}</p>
      </Document>
    )
  }

  // Don't forget to typecheck with your own logic.
  // Any value can be thrown, not just errors!
  let errorMessage = 'Unknown error'
  // if (isDefinitelyAnError(error)) {
  // errorMessage = error.message
  // }

  return (
    <Document>
      <h1>Uh oh ...</h1>
      <p>Something went wrong.</p>
      <pre>{errorMessage}</pre>
    </Document>
  )
}
