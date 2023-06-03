import type {V2_MetaFunction} from '@remix-run/node'
import {Outlet} from '@remix-run/react'
import {MainNav} from '~/components/main-nav'
import {Search} from '~/components/search'
import TeamSwitcher from '~/components/team-switcher'
import {UserNav} from '~/components/user-nav'

export const meta: V2_MetaFunction = () => {
  return [{title: 'Dashboard'}]
}

export default function DashboardLayout() {
  return (
    <>
      <div className="hidden flex-col md:flex">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <TeamSwitcher />
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              <Search />
              <UserNav />
            </div>
          </div>
        </div>
        <Outlet />
      </div>
    </>
  )
}
