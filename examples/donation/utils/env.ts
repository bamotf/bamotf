/* eslint-disable turbo/no-undeclared-env-vars */
import {createEnv} from '@t3-oss/env-nextjs'
import {z} from 'zod'

const STRING_REQUIRED = z.string().min(1, 'Required')

export const env = createEnv({
  server: {
    API_KEY: STRING_REQUIRED,
    BAMOTF_SERVER_URL: STRING_REQUIRED.url(),
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),
    PUSHER_APP_ID: STRING_REQUIRED,
    PUSHER_SECRET: STRING_REQUIRED,
    XPUB_DONATION: STRING_REQUIRED,
    WEBHOOK_SECRET: STRING_REQUIRED,
  },
  client: {
    // TODO vercel env vars are not working
    NEXT_PUBLIC_PUSHER_CLUSTER: STRING_REQUIRED,
    NEXT_PUBLIC_PUSHER_KEY: STRING_REQUIRED,
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_PUSHER_CLUSTER: process.env.NEXT_PUBLIC_PUSHER_KEY,
    NEXT_PUBLIC_PUSHER_KEY: process.env.NEXT_PUBLIC_PUSHER_KEY,
  },
})
