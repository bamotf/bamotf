import {Ratelimit} from '@upstash/ratelimit'
import {Redis} from '@upstash/redis'
import {badRequest, getClientIPAddress, serverError} from 'remix-utils'

import {env} from './env.server'

const redis = new Redis({
  url: env.REDIS_URL,
  token: '',
  enableTelemetry: false,
})

/**
 * Create a new ratelimiter, that allows 100 requests per 10 seconds
 */
export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(1, '10 s'),
  prefix: '@bam-otf/server/ratelimit',
  analytics: false,
})

/**
 * Require that a request is rate limited
 *
 * @param request
 * @returns
 */
export async function requireRateLimit(request: Request) {
  let ipAddress = getClientIPAddress(request)
  // FIX: this heavily depends on the request. We should probably use a different
  // identifier for the ratelimit
  if (!ipAddress) {
    return
  }

  const {success} = await ratelimit.limit(ipAddress)
  if (!success) {
    throw badRequest({message: 'Too many requests'})
  }
}
