import * as React from 'react'
import {Link, type LinkProps} from '@remix-run/react'

import {cn} from '~/utils/css'

export const StyledLink = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({className, ...props}, ref) => (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <Link
      ref={ref}
      className={cn('underline hover:no-underline', className)}
      {...props}
    />
  ),
)
StyledLink.displayName = 'StyledLink'
