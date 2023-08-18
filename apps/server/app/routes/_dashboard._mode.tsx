import {type LoaderArgs} from '@remix-run/node'
import {Outlet, useFetcher, useLoaderData} from '@remix-run/react'

import {Tabs, TabsList, TabsTrigger} from '~/components/ui/tabs'
import {requireUserId} from '~/utils/auth.server'
import {cn} from '~/utils/css'
import {enabledModes, requireEnabledMode, type Mode} from '~/utils/mode.server'

export async function loader({params, request}: LoaderArgs) {
  await requireUserId(request)
  const currentMode = await requireEnabledMode(request)

  return {
    currentMode,
    enabledModes,
  }
}

export default function DashboardLayout() {
  const {currentMode, enabledModes} = useLoaderData<typeof loader>()
  const fetcher = useFetcher()

  return (
    <>
      <Tabs
        value={currentMode}
        onValueChange={mode => {
          fetcher.submit(
            {
              mode,
            },
            {
              method: 'post',
              action: '/resources/mode',
            },
          )
        }}
        className={cn('flex border-b -mt-[23px] transition-colors', {
          'border-b-info': currentMode === 'dev',
          'border-b-warning': currentMode === 'test',
        })}
      >
        <TabsList
          className={cn(
            'mx-auto rounded-b-none rounded-t-sm h-auto transition-colors',
            {
              'bg-info': currentMode === 'dev',
              'bg-warning': currentMode === 'test',
            },
          )}
        >
          {enabledModes.dev && (
            <EnvTabTrigger current={currentMode} value="dev">
              Development
            </EnvTabTrigger>
          )}
          {enabledModes.test && (
            <EnvTabTrigger current={currentMode} value="test">
              Test
            </EnvTabTrigger>
          )}
          {enabledModes.production && (
            <EnvTabTrigger current={currentMode} value="production">
              Production
            </EnvTabTrigger>
          )}
        </TabsList>
      </Tabs>

      <Outlet />
    </>
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
      className={cn(
        `text-[10px] leading-[14px] px-1.5 py-0 rounded-[2px] transition-colors`,
        {
          'text-info-foreground': current === 'dev',
          'text-warning-foreground': current === 'test',
        },
      )}
      value={value}
    >
      {children}
    </TabsTrigger>
  )
}
