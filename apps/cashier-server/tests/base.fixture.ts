import {test as base} from '@playwright/test'
import resetDb from './reset-db'
import resetBitcoinCore from './reset-btc-core'
import resetQueues from './reset-queues'
import * as bitcoinCore from '~/utils/bitcoin-core'
import * as faker from './faker'

export type Options = {
  bitcoinCore: typeof bitcoinCore
  faker: typeof faker
}

export const test = base.extend<Options>({
  bitcoinCore,
  faker,
})

test.beforeEach(async () => {
  await resetDb()
  await resetQueues()
  await resetBitcoinCore()
})

export const expect = test.expect
