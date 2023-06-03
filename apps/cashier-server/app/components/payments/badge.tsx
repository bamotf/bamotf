import type {PaymentIntentStatus} from '@prisma/client'
import type {BadgeProps as BadgeBaseProps} from '~/components/ui/badge'
import {Badge as BadgeBase} from '~/components/ui/badge'
import {cn} from '~/utils/css'

export type BadgeProps = Omit<BadgeBaseProps, 'children'> & {
  status: PaymentIntentStatus
}

export function Badge({status, className, ...props}: BadgeProps) {
  const color: Record<PaymentIntentStatus, string> = {
    succeeded: 'bg-green-100 text-green-900 hover:bg-green-100/80',
    canceled: 'bg-red-100 text-red-900 hover:bg-red-100/80',
    pending: '',
    processing: '',
  }

  return (
    <BadgeBase
      variant="secondary"
      {...props}
      className={cn(color[status], className)}
    >
      {status}
    </BadgeBase>
  )
}
