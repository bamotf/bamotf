import {NavLink} from '@remix-run/react'

import {cn} from '~/utils/css'

const CONFIG = [
  // TODO: revisit this
  // {
  //   name: 'Overview',
  //   href: '/',
  // },
  {
    name: 'Payments',
    href: '/payments',
  },
]

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn('flex items-center space-x-4 lg:space-x-6', className)}
      {...props}
    >
      {CONFIG.map(item => (
        <NavLink
          key={item.name}
          to={item.href}
          className={({isActive}) =>
            `text-sm font-medium transition-colors hover:text-primary ${
              isActive ? '' : 'text-muted-foreground'
            }`
          }
        >
          {item.name}
        </NavLink>
      ))}
    </nav>
  )
}
