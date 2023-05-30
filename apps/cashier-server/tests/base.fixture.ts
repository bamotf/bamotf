import {test as base} from '@playwright/test'
import resetDb from './reset-db'

export const test = base.extend({})

test.beforeEach(async () => {
  await resetDb()
})

export const expect = test.expect
