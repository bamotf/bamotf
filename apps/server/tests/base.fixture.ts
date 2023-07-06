import {test as base} from 'vitest'

import * as bitcoinCore from '~/utils/bitcoin-core'
import faker from './faker'

export * from 'vitest'

export type Options = {
  bitcoinCore: typeof bitcoinCore
  faker: typeof faker
  headers: {
    Authorization: string
  }
}

export const test = base.extend<Options>({
  bitcoinCore,
  faker,
  headers: {
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    Authorization: `Bearer ${process.env.API_KEY}`,
  },
})
