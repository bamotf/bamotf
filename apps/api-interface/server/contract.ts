import {initContract} from '@ts-rest/core'
import {contract as paymentIntents} from './payment-intents.contracts'

const c = initContract()

export const contract = c.router({
  paymentIntents,
})
