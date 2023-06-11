/**
 * All supported fiat currency codes.
 */
export const FIAT_CURRENCY_CODES = [
  'AED',
  'AUD',
  'BDT',
  'BHD',
  'BMD',
  'BRL',
  'CAD',
  'CHF',
  'CLP',
  'CNY',
  'CZK',
  'DKK',
  'EUR',
  'GBP',
  'HKD',
  'HUF',
  'IDR',
  'ILS',
  'INR',
  'JPY',
  'KRW',
  'KWD',
  'LKR',
  'MMK',
  'MXN',
  'MYR',
  'NGN',
  'NOK',
  'NZD',
  'PHP',
  'PKR',
  'PLN',
  'RUB',
  'SAR',
  'SEK',
  'SGD',
  'THB',
  'TRY',
  'TWD',
  'UAH',
  'USD',
  'VND',
] as const

export type FiatCurrencyCode = (typeof FIAT_CURRENCY_CODES)[number]

/**
 * All supported currency codes.
 */
export const CURRENCY_CODES = ['BTC', ...FIAT_CURRENCY_CODES] as const

export type CurrencyCode = (typeof CURRENCY_CODES)[number]
