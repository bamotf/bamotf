import type {LoaderArgs, V2_MetaFunction} from '@remix-run/node'
import {Outlet} from '@remix-run/react'

import {Icons} from '~/components/icons'
import {MainNav} from '~/components/main-nav'
import {Search} from '~/components/search'
import {UserNav} from '~/components/user-nav'
import {requireUserId} from '~/utils/auth.server'

export const meta: V2_MetaFunction = () => {
  return [{title: 'Dashboard'}]
}
export async function loader({request}: LoaderArgs) {
  await requireUserId(request)
  return {}
}

export default function DashboardLayout() {
  return (
    <>
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
