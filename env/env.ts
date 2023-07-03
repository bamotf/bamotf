import {createEnv} from '@t3-oss/env-core'
import {ConnectionString} from 'connection-string'
import {z} from 'zod'

export const env = createEnv({
  clientPrefix: 'NEXT_PUBLIC_',
  server: {
    BAMOTF_API_KEY: z.string().min(1, 'Required'),
    BAMOTF_SERVER_URL: z.string().min(1, 'Required').url(),

    BITCOIN_CORE_URL: z
      .string()
      .min(1, 'Required')
      .url()
      .transform(url => {
        return new ConnectionString(url, {
          protocol: 'http',
        })
      }),

    KV_REST_API_READ_ONLY_TOKEN: z.string().min(1, 'Required'),
    KV_REST_API_TOKEN: z.string().min(1, 'Required'),
    KV_REST_API_URL: z.string().min(1, 'Required').url(),
    KV_URL: z.string().min(1, 'Required').url(),
    LOG_LEVEL: z.string(),

    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),

    NX_DAEMON: z.string().min(1, 'Required'),
    POSTGRES_URL: z.string().min(1, 'Required').url(),

    PRICE_DATA_SERVER_CLEARNET_URL: z
      .string()
      .default('https://price.bisq.wiz.biz/getAllMarketPrices'),

    PRICE_DATA_SERVER_TOR_URL: z
      .string()
      .default(
        'http://wizpriceje6q5tdrxkyiazsgu7irquiqjy2dptezqhrtu7l2qelqktid.onion/getAllMarketPrices',
      ),

    PUSHER_APP_ID: z.string().min(1, 'Required'),
    PUSHER_APP_SECRET: z.string().min(1, 'Required'),
    REDIS_URL: z.string().min(1, 'Required').url(),
    RUNNING_TESTS: z.coerce.boolean().default(false),
    SESSION_SECRET: z.string().default('not-a-secret'),
    TURBO_REMOTE_ONLY: z.string().min(1, 'Required'),
    TURBO_RUN_SUMMARY: z.string().min(1, 'Required'),
    VERCEL: z.string(),
    VERCEL_ENV: z.string(),
    VERCEL_GIT_COMMIT_AUTHOR_LOGIN: z.string().min(1, 'Required'),
    VERCEL_GIT_COMMIT_AUTHOR_NAME: z.string().min(1, 'Required'),
    VERCEL_GIT_COMMIT_MESSAGE: z.string().min(1, 'Required'),
    VERCEL_GIT_COMMIT_REF: z.string().min(1, 'Required'),
    VERCEL_GIT_COMMIT_SHA: z.string().min(1, 'Required'),
    VERCEL_GIT_PREVIOUS_SHA: z.string().min(1, 'Required'),
    VERCEL_GIT_PROVIDER: z.string().min(1, 'Required'),
    VERCEL_GIT_PULL_REQUEST_ID: z.string().min(1, 'Required'),
    VERCEL_GIT_REPO_ID: z.string().min(1, 'Required'),
    VERCEL_GIT_REPO_OWNER: z.string().min(1, 'Required'),
    VERCEL_GIT_REPO_SLUG: z.string().min(1, 'Required'),
    VERCEL_URL: z.string().min(1, 'Required').url(),
    WEBHOOK_URL: z.string().min(1, 'Required').url(),
    WEBHOOK_SECRET: z.string().min(1, 'Required'),
    XPUB_DONATION: z.string().min(1, 'Required'),
  },
  client: {
    NEXT_PUBLIC_PUSHER_CLUSTER: z.string().min(1, 'Required'),
    NEXT_PUBLIC_PUSHER_KEY: z.string().min(1, 'Required'),
  },
  runtimeEnv: process.env,
})
