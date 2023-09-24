import {createSecret} from './encryption.server'
import {z} from './zod'

const URL_SCHEMA = z.string().url()
const URL_REQUIRED = URL_SCHEMA.min(1, 'Required')
const BOOLEAN = z.preprocess(a => a === 'true', z.boolean())
const CONNECTION_STRING = URL_SCHEMA.transform(url => {
  return new URL(url)
})

const envSchema = z.object({
  /**
   * The environment that the code is running in for the bamotf team.
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
   * Connection string for prisma.
   */
  POSTGRES_URL: URL_REQUIRED,

  /**
   * Connection string for bullmq.
   */
  REDIS_URL: URL_REQUIRED,

  /**
   * The bitcoin core connection string we use to check for payments on mainnet.
   */
  MAINNET_BITCOIN_CORE_URL: CONNECTION_STRING.optional(),

  /**
   * The bitcoin core connection string we use to check for payments on testnet.
   */
  TESTNET_BITCOIN_CORE_URL: CONNECTION_STRING.optional(),

  /**
   * When DEV_MODE_ENABLED is true, the server will make the bitcoin core
   * connection optional and will enable the simulate payment function that
   * bypass the checks on network. This is used to determine the network.
   *
   * @default true
   */
  DEV_MODE_ENABLED: BOOLEAN.default(true),

  /**
   * This is the webhook url that we send events to when some
   * event happens in the server.
   * For example, when a payment is received, we send a webhook
   */
  DEV_WEBHOOK_URL: URL_SCHEMA.optional(),

  /**
   * This is the secret that we use to sign the webhook events
   * that we send to the webhook url.
   */
  DEV_WEBHOOK_SECRET: z.string().optional(),

  /**
   * This is the API key that the server will use to authenticate clients
   * that want to use the API.
   */
  DEV_API_KEY: z.string().optional(),

  /**
   * When running tests, we don't want wait.
   */
  RUNNING_E2E: BOOLEAN.default(false),

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

type EnvSchema = z.infer<typeof envSchema>
type EnvSchemaPartial = Omit<
  EnvSchema,
  | 'DEV_MODE_ENABLED'
  | 'DEV_API_KEY'
  | 'DEV_WEBHOOK_SECRET'
  | 'DEV_WEBHOOK_URL'
  | 'MAINNET_BITCOIN_CORE_URL'
  | 'TESTNET_BITCOIN_CORE_URL'
>

const refinedEnvSchema = envSchema.superRefine(
  (
    arg,
    ctx,
  ): arg is EnvSchemaPartial &
    (
      | {
          DEV_MODE_ENABLED: true
          DEV_API_KEY: string
          DEV_WEBHOOK_SECRET: string
          DEV_WEBHOOK_URL: string
          MAINNET_BITCOIN_CORE_URL: URL | undefined
          TESTNET_BITCOIN_CORE_URL: URL | undefined
        }
      | {
          DEV_MODE_ENABLED: false
          DEV_API_KEY: string | undefined
          DEV_WEBHOOK_SECRET: string | undefined
          DEV_WEBHOOK_URL: string | undefined
          MAINNET_BITCOIN_CORE_URL: URL | undefined
          TESTNET_BITCOIN_CORE_URL: URL | undefined
        }
    ) => {
    const {
      DEV_MODE_ENABLED,
      DEV_API_KEY,
      DEV_WEBHOOK_SECRET,
      DEV_WEBHOOK_URL,
      MAINNET_BITCOIN_CORE_URL,
      TESTNET_BITCOIN_CORE_URL,
    } = arg

    // When DEV_MODE_ENABLED is false, we require the MAINNET_BITCOIN_CORE_URL
    //  or TESTNET_BITCOIN_CORE_URL to be set.
    if (!DEV_MODE_ENABLED) {
      if (!MAINNET_BITCOIN_CORE_URL && !TESTNET_BITCOIN_CORE_URL) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            'MAINNET_BITCOIN_CORE_URL or TESTNET_BITCOIN_CORE_URL is required when DEV_MODE_ENABLED is false',
          path: ['MAINNET_BITCOIN_CORE_URL', 'TESTNET_BITCOIN_CORE_URL'],
        })
      }
    } else {
      // When DEV_MODE_ENABLED is true, we require the DEV_WEBHOOK_URL,
      // DEV_WEBHOOK_SECRET, and DEV_API_KEY to be set.
      if (!DEV_WEBHOOK_URL) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'DEV_WEBHOOK_URL is required when DEV_MODE_ENABLED is true',
          path: ['DEV_WEBHOOK_URL'],
        })
      }
      if (!DEV_WEBHOOK_SECRET) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            'DEV_WEBHOOK_SECRET is required when DEV_MODE_ENABLED is true',
          path: ['DEV_WEBHOOK_SECRET'],
        })
      }
      if (!DEV_API_KEY) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'DEV_API_KEY is required when DEV_MODE_ENABLED is true',
          path: ['DEV_API_KEY'],
        })
      }
    }

    return z.NEVER
  },
)

/**
 * Environment variables that are required for the server to run
 */
export const env = refinedEnvSchema.parse(process.env)
