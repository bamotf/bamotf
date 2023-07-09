import type {Prisma} from '~/utils/prisma.server'
import {
  CURRENCY_CODES,
  FIAT_CURRENCY_CODES,
  type CurrencyCode,
} from '../../../../config/currency'
import faker from './index'

export function currency() {
  return faker.helpers.arrayElement(CURRENCY_CODES)
}

export function fiat() {
  return faker.helpers.arrayElement(FIAT_CURRENCY_CODES)
}

export function paymentIntent(
  props: {
    amount?: bigint
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
    amount = faker.number.bigInt({
      // btcoind has a minimum of 1000 satoshis
      min: 1000,
      max: 10000,
    }),
  } = props

  if (chosenCurrency !== 'BTC') {
    // FIX: the amount in fiat can be much less than 1000 sats
    // depending on the currency selected and the payment will fail
    // chosenCurrency = fiat()
    chosenCurrency = 'USD'
    amount = faker.number.bigInt({min: 10000, max: 20000})
  }

  return {
    address,
    amount,
    description,
    tolerance,
    currency: chosenCurrency,
  }
}
