import * as dotenv from 'dotenv'
dotenv.config({
  path: '../../.env',
})

import resetDb from './reset-db'
import {beforeEach} from 'vitest'

beforeEach(async () => {
  await resetDb()
})
