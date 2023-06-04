import {faker} from '@faker-js/faker'
import * as bitcoin from './bitcoin'
import * as paymentIntent from './payment-intent'

faker.bitcoin = bitcoin
faker.paymentIntent = paymentIntent

declare module '@faker-js/faker' {
  interface Faker {
    bitcoin: typeof bitcoin
    paymentIntent: typeof paymentIntent
  }
}

export default faker
