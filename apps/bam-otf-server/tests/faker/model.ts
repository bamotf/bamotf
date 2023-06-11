import type {Prisma} from '@prisma/client'

import {
  CURRENCY_CODES,
  FIAT_CURRENCY_CODES,
  type CurrencyCode,
} from '~/config/currency'
import faker from './index'

export function currency() {
  return faker.helpers.arrayElement(CURRENCY_CODES)
}

export function fiat() {
  return faker.helpers.arrayElement(FIAT_CURRENCY_CODES)
}

export function paymentIntent(
  props: {
    amount?: number
    address?: string
    currency?: CurrencyCode
    description?: string
    tolerance?: number
  } = {},
) {
  let {
    currency: chosenCurrency = currency(),
    address = faker.bitcoin.createRandomAddress(),
    description = faker.finance.transactionDescription(),
    tolerance = 0.02,
    // amount in BTC is much less because I haven't implemented the auto-mining when out of funds
    // on the simulatePayment function
    amount = faker.number.float({
      min: 100,
      max: 1000,
      precision: 8,
    }) / 1e8,
  } = props

  if (chosenCurrency !== 'BTC') {
    chosenCurrency = fiat()
    amount = faker.number.float({min: 1, max: 100, precision: 2})
  }

  return {
    address,
    amount,
    description,
    tolerance,
    currency: chosenCurrency,
  } satisfies Prisma.PaymentIntentCreateInput
}
