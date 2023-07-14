import Redis, {type RedisOptions, type Redis as RedisType} from 'ioredis'

import {env} from './env.server'

let redis: RedisType

declare global {
  var __redis: RedisType | undefined
}

const redisOptions: RedisOptions = {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
}

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the Redis with every change either.
if (env.NODE_ENV === 'production') {
  redis = new Redis(env.REDIS_URL || '', redisOptions)
} else {
  if (!global.__redis) {
    global.__redis = new Redis(env.REDIS_URL || '', redisOptions)
  }
  redis = global.__redis
}

export {redis}
