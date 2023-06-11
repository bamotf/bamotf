import {cssBundleHref} from '@remix-run/css-bundle'
import {json, type LinksFunction, type SerializeFrom} from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react'

import {TailwindIndicator} from './components/tailwind-indicator'

import './globals.css'

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{rel: 'stylesheet', href: cssBundleHref}] : []),
]

export async function loader() {
  return json({
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
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <TailwindIndicator />
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
          }}
        />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
