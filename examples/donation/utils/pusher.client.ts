/* eslint-disable turbo/no-undeclared-env-vars */
import PusherClient from 'pusher-js'

import {env} from '../../../env/env'

export const pusherClient = new PusherClient(env.NEXT_PUBLIC_PUSHER_KEY!, {
  cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER!,
})
