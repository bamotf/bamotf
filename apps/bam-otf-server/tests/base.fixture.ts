import {test as base} from '@playwright/test'
import {logger} from 'logger'

import * as bitcoinCore from '~/utils/bitcoin-core'
import faker from './faker'
import resetBitcoinCore from './reset-btc-core'
import resetDb from './reset-db'
import resetQueues from './reset-queues'

export type Options = {
  bitcoinCore: typeof bitcoinCore
  faker: typeof faker
}

export const test = base.extend<Options>({
  bitcoinCore,
  faker,
})

test.beforeEach(async () => {
  logger.debug('Resetting all services...')

  await resetDb()
  await resetQueues()
  await resetBitcoinCore()
})

export const expect = test.expect
