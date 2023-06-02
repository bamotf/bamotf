import {test as base} from '@playwright/test'
import resetDb from './reset-db'
import resetBitcoinCore from './reset-btc-core'
import resetQueues from './reset-queues'

export const test = base.extend({})

test.beforeEach(async () => {
  await resetDb()
  await resetQueues()
  await resetBitcoinCore()
})

export const expect = test.expect
