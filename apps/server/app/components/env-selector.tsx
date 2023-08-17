import {useLocation, useNavigate} from '@remix-run/react'

import {Tabs, TabsList, TabsTrigger} from '~/components/ui/tabs'
import {cn} from '~/utils/css'
import type {getEnabledModes, Mode} from '~/utils/mode.server'

export function EnvSelector({
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
