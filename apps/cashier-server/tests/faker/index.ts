import {faker} from '@faker-js/faker'

import * as bitcoin from './bitcoin'
import * as db from './db'
import * as model from './model'

faker.bitcoin = bitcoin
faker.db = db
faker.model = model

declare module '@faker-js/faker' {
  interface Faker {
    /**
     * Helpers to create fake data for bitcoin
     */
    bitcoin: typeof bitcoin

    /**
     * Helpers to create fake data for requests
     */
    model: typeof model

    /**
     * Helpers to create fake data in the database
     */
    db: typeof db
  }
}

export default faker
