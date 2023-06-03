/* eslint-disable import/first */
import {ConnectionString} from 'connection-string'
import {z} from './zod'

const STRING_REQUIRED = z.string().min(1, 'Required')

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  DATABASE_CONNECTION_STRING: STRING_REQUIRED.url(),
  REDIS_URL: STRING_REQUIRED.url(),
  BITCOIN_CORE_CONNECTION_STRING: STRING_REQUIRED.url().transform(url => {
    return new ConnectionString(url, {
      protocol: 'http',
    })
  }),
  CASHIER_WEBHOOK_URL: STRING_REQUIRED.url(),
  CASHIER_SECRET: STRING_REQUIRED,
  RUNNING_TESTS: z.coerce.boolean().default(false),
})

/**
 * Environment variables that are required for the server to run
 */
export const env = envSchema.parse(process.env)