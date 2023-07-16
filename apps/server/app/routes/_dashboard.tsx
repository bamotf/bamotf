import type {LoaderArgs, V2_MetaFunction} from '@remix-run/node'
import {Outlet, useLoaderData} from '@remix-run/react'

import {Icons} from '~/components/icons'
import {MainNav} from '~/components/main-nav'
import {Search} from '~/components/search'
import {UserNav} from '~/components/user-nav'
import {requireUserId} from '~/utils/auth.server'
import {env} from '~/utils/env.server'

export const meta: V2_MetaFunction = () => {
  return [{title: 'Dashboard'}]
}
export async function loader({request}: LoaderArgs) {
  await requireUserId(request)
  return {
    MODE: env.MODE,
  }
}

export default function DashboardLayout() {
  const data = useLoaderData<typeof loader>()

  const modeBanner: Record<typeof env.MODE, React.JSX.Element | null> = {
    development: (
      <div className="flex bg-destructive text-destructive-foreground text-xs font-medium p-2 justify-center">
        Development mode - Go to
        <a href="/simulate" target="_blank" className="underline mx-1.5">
          simulator
        </a>
        to make payments
      </div>
    ),
    preview: (
      <div className="flex bg-success-foreground text-success text-xs font-medium p-2 justify-center">
        Preview mode - Use some
        <a
          href="https://bitcoinfaucet.uo1.net/"
          target="_blank"
          className="underline mx-1.5"
          rel="noreferrer"
        >
          Bitcoin faucet
        </a>
        to get some test coins
      </div>
    ),
    production: null,
  }

  return (
    <>
      {modeBanner[data.MODE]}
      <div className="hidden flex-col md:flex">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <div className="mr-4 hidden md:flex">
              <Icons.Logo />
              {/* <TeamSwitcher /> */}
              <MainNav className="mx-6" />
            </div>
            <div className="ml-auto flex items-center space-x-4">
              {/* <Search /> */}
              <UserNav />
            </div>
          </div>
        </div>
        <Outlet />
      </div>
    </>
  )
}
