import {test as base} from 'vitest'

import * as bitcoinCore from '~/utils/bitcoin-core'
import faker from './faker'
import * as request from './request'

export * from 'vitest'

export type Options = {
  request: typeof request

  /**
   * A Bitcoin Core client.
   */
  bitcoinCore: typeof bitcoinCore

  /**
   * A Faker instance that can be used to generate fake data.
   * You can also fake `db` data with `faker.db`.
   */
  faker: typeof faker
}

export const test = base.extend<Options>({
  bitcoinCore,
  faker,
  request,
})
