import {
  Badge as BadgeBase,
  type BadgeProps as BadgeBaseProps,
} from '~/components/ui/badge'
import {cn} from '~/utils/css'
import type {PaymentIntentStatus} from '~/utils/prisma.server'
import {Icons} from '../icons'

export type BadgeProps = Omit<BadgeBaseProps, 'children'> & {
  status: PaymentIntentStatus
}

export function Badge({status, className, ...props}: BadgeProps) {
  const color: Record<PaymentIntentStatus, string> = {
    succeeded: 'text-success bg-success/10 hover:bg-success/5',
    canceled: 'text-destructive bg-destructive/10 hover:bg-destructive/5',
    pending: '',
    processing: 'text-warning bg-warning/10 hover:bg-warning/5',
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
    <BadgeBase
      {...props}
      variant="secondary"
      className={cn(
        color[status],
        // 'inline-flex items-center border rounded-sm px-1.5 py-px text-xs font-normal transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent',
        className,
      )}
    >
      {content[status]}
    </BadgeBase>
  )
}
