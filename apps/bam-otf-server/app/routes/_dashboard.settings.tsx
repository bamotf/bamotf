import {Outlet, type V2_MetaFunction} from '@remix-run/react'

import {SidebarNav} from '~/components/side-nav'
import {Separator} from '~/components/ui/separator'

const sidebarNavItems = [
  {
    title: 'Account',
    href: '/settings',
  },
]

export const meta: V2_MetaFunction = () => {
  return [{title: `Settings`}]
}

export default function Settings() {
  return (
    <div className="hidden space-y-6 p-10 pb-16 md:block">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and some other preferences.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex-1 lg:max-w-2xl">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
