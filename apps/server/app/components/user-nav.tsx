import {useRef} from 'react'
import {Form, Link, useSubmit} from '@remix-run/react'
import {LogOut, PlusCircle, Settings, User} from 'lucide-react'

import {Avatar, AvatarFallback} from '~/components/ui/avatar'
import {Button} from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import {useUser} from '~/utils/user'

export function UserNav() {
  const user = useUser()
  const submit = useSubmit()
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild aria-label="user-nav">
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            {/* <AvatarImage src="/avatars/01.png" alt="" /> */}
            <AvatarFallback>
              {(user.name || user.username).toUpperCase().slice(0, 2)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.username}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {/* <DropdownMenuItem asChild>
            <Link to="/settings/profile">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem> */}
          <DropdownMenuItem asChild>
            <Link to="/settings">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
              {/* <DropdownMenuShortcut>⌘S</DropdownMenuShortcut> */}
            </Link>
          </DropdownMenuItem>
          {/* <DropdownMenuItem>
            <PlusCircle className="mr-2 h-4 w-4" />
            <span>New Team</span>
          </DropdownMenuItem> */}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        <Form action="/logout" method="POST" ref={formRef}>
          <DropdownMenuItem
            asChild
            className="cursor-pointer w-full" // this prevents the menu from closing before the form submission is completed
            onSelect={event => {
              event.preventDefault()
              submit(formRef.current)
            }}
          >
            <button type="submit">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </button>
          </DropdownMenuItem>
        </Form>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
