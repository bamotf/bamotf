import {NavLink} from '@remix-run/react'

import {buttonVariants} from '~/components/ui/button'
import {cn} from '~/utils/css'

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
  }[]
}

export function SidebarNav({className, items, ...props}: SidebarNavProps) {
  return (
    <nav
      className={cn(
        'flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1',
        className,
      )}
      {...props}
    >
      {items.map(item => (
        <NavLink
          key={item.href}
          to={item.href}
          className={({isActive, isPending}) =>
            cn(
              buttonVariants({variant: 'ghost'}),
              isPending
                ? 'pending'
                : isActive
                ? 'bg-muted hover:bg-muted'
                : 'hover:bg-transparent hover:underline',
              'justify-start',
            )
          }
        >
          {item.title}
        </NavLink>
      ))}
    </nav>
  )
}
