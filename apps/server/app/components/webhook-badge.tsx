import {Badge as BaseBadge} from '~/components/ui/badge'
import {cn} from '~/utils/css'

export function WebhookBadge({status}: {status: number}) {
  return (
    <BaseBadge
      className={cn({
        'bg-green-100 text-green-900 hover:bg-green-100/80':
          status > 200 && status < 300,
        'bg-gray-100 text-gray-900 hover:bg-gray-100/80':
          status >= 300 && status < 500,
        'bg-red-100 text-red-900 hover:bg-red-100/80': status >= 500,
      })}
    >
      {status}
    </BaseBadge>
  )
}
