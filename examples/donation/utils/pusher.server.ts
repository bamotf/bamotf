/* eslint-disable turbo/no-undeclared-env-vars */
import PusherServer from 'pusher'

import {env} from '../../../env/env'

export const pusherServer = new PusherServer({
  appId: env.PUSHER_APP_ID!,
  key: env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: env.PUSHER_APP_SECRET!,
  cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER!,
})
