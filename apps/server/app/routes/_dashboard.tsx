import {type LoaderArgs, type V2_MetaFunction} from '@remix-run/node'
import {Outlet, useLoaderData} from '@remix-run/react'

import {EnvSelector} from '~/components/env-selector'
import {Icons} from '~/components/icons'
import {MainNav} from '~/components/main-nav'
import {Search} from '~/components/search'
import TeamSwitcher from '~/components/team-switcher'
import {UserNav} from '~/components/user-nav'
import {requireUserId} from '~/utils/auth.server'
import {getEnabledModes, requireEnabledMode} from '~/utils/mode.server'

export const meta: V2_MetaFunction = () => {
  return [{title: 'Dashboard'}]
}

export async function loader({params, request}: LoaderArgs) {
  await requireUserId(request)

  const currentMode = requireEnabledMode(params.mode)
  const enabledModes = getEnabledModes()

  return {
    currentMode,
    enabledModes,
  }
}

export default function DashboardLayout() {
  const {currentMode, enabledModes} = useLoaderData<typeof loader>()

  return (
    <>
      <div className="hidden flex-col md:flex">
        <div className="relative border-b">
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

          <EnvSelector modes={enabledModes} current={currentMode} />
        </div>
        <Outlet />
      </div>
    </>
  )
}
