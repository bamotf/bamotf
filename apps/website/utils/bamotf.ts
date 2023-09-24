import {Bamotf} from '@bamotf/node'

import {env} from './env'

export const bamotf = new Bamotf(env.BAMOTF_API_KEY, {
  baseURL: env.BAMOTF_SERVER_URL,
})
