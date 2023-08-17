import {redirect, type LoaderArgs, type V2_MetaFunction} from '@remix-run/node'
import {Outlet, useLoaderData, useLocation, useNavigate} from '@remix-run/react'

import {Icons} from '~/components/icons'
import {MainNav} from '~/components/main-nav'
import {Search} from '~/components/search'
import TeamSwitcher from '~/components/team-switcher'
import {Tabs, TabsList, TabsTrigger} from '~/components/ui/tabs'
import {UserNav} from '~/components/user-nav'
import {requireUserId} from '~/utils/auth.server'
import {cn} from '~/utils/css'
import {env} from '~/utils/env.server'

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

type Mode = keyof ReturnType<typeof getEnabledModes>

/**
 * Get enabled mode from environment variables
 */
function getEnabledModes() {
  return {
    dev: env.DEV_MODE_ENABLED,
    test: !!env.TESTNET_BITCOIN_CORE_URL,
    production: !!env.MAINNET_BITCOIN_CORE_URL,
  }
}

/**
 * Check if mode is enabled and return it
 *
 * @param userMode the mode user wants to use
 * @returns
 */
function requireEnabledMode(userMode: string = '') {
  const enabledModes = getEnabledModes()
  let mode: Mode

  switch (userMode) {
    case 'dev':
      mode = 'dev'
      break
    case 'test':
      mode = 'test'
      break
    case '':
      mode = 'production'
      break
    default:
      throw new Response(`Invalid mode: ${userMode}`, {
        status: 400,
        statusText: 'Invalid mode',
      })
  }

  // if mode is not enabled, redirect to the first enabled mode
  if (!enabledModes[mode]) {
    const priority: Mode[] = ['dev', 'production', 'test']
    // find the first enabled mode
    mode = priority.filter(m => enabledModes[m])[0]

    throw redirect(mode === 'production' ? '/' : `/${mode}`, {
      statusText: `Mode ${mode} is not enabled`,
    })
  }

  return mode
}

function EnvSelector({
  current,
  modes,
}: {
  current: Mode
  modes: ReturnType<typeof getEnabledModes>
}) {
  const navigate = useNavigate()
  // get current route
  const {pathname} = useLocation()
  // remove mode from route
  const route = pathname.replace(/^\/(dev|test)\//, '/')

  return (
    <Tabs
      value={current}
      onValueChange={env =>
        navigate(`${env === 'production' ? '' : env}${route}`)
      }
      className={cn('flex border-b -mt-[22px] -mb-px', {
        'border-b-info': current === 'dev',
        'border-b-warning': current === 'test',
      })}
    >
      <TabsList
        className={cn('mx-auto rounded-b-none rounded-t-sm h-auto', {
          'bg-info': current === 'dev',
          'bg-warning': current === 'test',
        })}
      >
        {modes.dev && (
          <EnvTabTrigger current={current} value="dev">
            Development
          </EnvTabTrigger>
        )}
        {modes.test && (
          <EnvTabTrigger current={current} value="test">
            Test
          </EnvTabTrigger>
        )}
        {modes.production && (
          <EnvTabTrigger current={current} value="production">
            Production
          </EnvTabTrigger>
        )}
      </TabsList>
    </Tabs>
  )
}

function EnvTabTrigger({
  current,
  value,
  children,
}: {
  current: Mode
  value: Mode
  children: React.ReactNode
}) {
  return (
    <TabsTrigger
      className={cn(`text-[10px] leading-[14px] px-1.5 py-0 rounded-[2px]`, {
        'text-info-foreground': current === 'dev',
        'text-warning-foreground': current === 'test',
      })}
      value={value}
    >
      {children}
    </TabsTrigger>
  )
}
