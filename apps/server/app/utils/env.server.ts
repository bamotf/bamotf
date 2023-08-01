import {ConnectionString} from 'connection-string'

import {createSecret} from './encryption.server'
import {z} from './zod'

const STRING_REQUIRED = z.string().min(1, 'Required')
const URL_REQUIRED = STRING_REQUIRED.url()

const envSchema = z.object({
  /**
   * The environment that the code is running in.
   * This is used to determine if we should enable certain features.
   * It is also used to determine if we should enable certain security features.
   *
   * @note development is the bamotf team developer time and production after built (docker).
   * @default development
   */
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),

  /**
   * The mode that the server is running in. This is used to determine the network
   * that the server is checking for payments on. And it is also used to determine
   * if we should enable certain features.
   * For example, we don't want to enable the `/simulate` when not running in development.
   *
   * @note development = regtest, preview = testnet and production = bitcoin.
   * @default development
   */
  // FIX: change this
  MODE: z.enum(['development', 'preview', 'production']).default('development'),

  /**
   * Connection string for prisma.
   */
  POSTGRES_URL: URL_REQUIRED,

  /**
   * Connection string for bullmq.
   */
  REDIS_URL: URL_REQUIRED,

  /**
   * The bitcoin core we use to check for payments.
   */
  // FIX: change this
  BITCOIN_CORE_URL: URL_REQUIRED.transform(url => {
    return new ConnectionString(url, {
      protocol: 'http',
    })
  }),

  /**
   * When running tests, we don't want wait.
   */
  RUNNING_E2E: z.coerce.boolean().default(false),

  /**
   * The url of the price data server.
   * This is used to get the price of bitcoin.
   */
  PRICE_DATA_SERVER_TOR_URL: z
    .string()
    .default(
      'http://wizpriceje6q5tdrxkyiazsgu7irquiqjy2dptezqhrtu7l2qelqktid.onion/getAllMarketPrices',
    ),

  /**
   * The url of the price data server.
   * This is used to get the price of bitcoin.
   */
  PRICE_DATA_SERVER_CLEARNET_URL: z
    .string()
    .default('https://price.bisq.wiz.biz/getAllMarketPrices'),

  /**
   * The secret that we use to sign the the session cookie.
   * This is used to prevent people from tampering with the session cookie.
   */
  SESSION_SECRET: z.string().default(createSecret()),
})

/**
 * Environment variables that are required for the server to run
 */
export const env = envSchema.parse(process.env)
