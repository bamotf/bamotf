import type {PaymentIntentStatus} from '@prisma/client'

import type {BadgeProps as BadgeBaseProps} from '~/components/ui/badge'
import {cn} from '~/utils/css'
import {Icons} from '../icons'

export type BadgeProps = Omit<BadgeBaseProps, 'children'> & {
  status: PaymentIntentStatus
}

export function Badge({status, className, ...props}: BadgeProps) {
  const color: Record<PaymentIntentStatus, string> = {
    succeeded: 'bg-green-100 text-green-900 hover:bg-green-100/80',
    canceled: 'bg-red-100 text-red-900 hover:bg-red-100/80',
    pending: 'bg-gray-100 text-gray-900 hover:bg-gray-100/80',
    processing: 'bg-yellow-100 text-yellow-900 hover:bg-yellow-100/80',
  }

  const content = {
    succeeded: (
      <>
        OK <Icons.Check className="ml-1 w-4 h-4" />
      </>
    ),
    canceled: (
      <>
        Failed <Icons.X className="ml-1 w-4 h-4" />
      </>
    ),
    pending: (
      <>
        Incomplete <Icons.Clock className="ml-1 w-3 h-3" />
      </>
    ),
    processing: (
      <>
        Confirming <Icons.Clock className="ml-1 w-3 h-3" />
      </>
    ),
  }

  return (
    <div
      {...props}
      className={cn(
        color[status],
        'inline-flex items-center border rounded-sm px-1.5 py-px text-xs font-normal transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent',
        className,
      )}
    >
      {content[status]}
    </div>
  )
}
