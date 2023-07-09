import type {CurrencyCode, FiatCurrencyCode} from '../../../config/currency'

type FormatOpts = {
  amount: bigint
  currency: CurrencyCode
  style?: 'currency' | 'decimal'
}

export function format(locale: string, opts: FormatOpts): string
export function format(opts: FormatOpts): string

/**
 * Format a currency amount visually
 */
export function format(x: any, y?: any): string {
  const locale = typeof x === 'string' ? x : 'en-US'
  const opts: FormatOpts = typeof x === 'string' ? y : x
  const {amount, currency, style = 'currency'} = opts
  const fractions = getFractionDigits(currency)
  const formatter = new Intl.NumberFormat(locale, {
    style,
    currency,
    ...fractions,
  })

  const formattedAmount = formatter.format(toFraction({amount, currency}))

  return formattedAmount
}

type FractionOpts = {
  amount: bigint
  currency: CurrencyCode
}

/**
 * Converts a bigint amount to a fraction based on the currency decimal places
 *
 * @param opts
 * @returns
 */
export function toFraction(opts: FractionOpts) {
  const {amount, currency} = opts
  const {maximumFractionDigits} = getFractionDigits(currency)

  const fractionMultiplier = 10 ** maximumFractionDigits
  const fraction = Number(amount) / fractionMultiplier

  return fraction
}

/**
 * Returns the minimum and maximum fraction digits for a given currency
 *
 * @param currency Currency code
 * @returns
 */
export function getFractionDigits(currency: CurrencyCode): {
  minimumFractionDigits: number
  maximumFractionDigits: number
} {
  const currenciesWithZeroDecimals: CurrencyCode[] = ['JPY', 'MMK', 'VND']
  const currenciesWithThreeDecimals: CurrencyCode[] = ['BDT']
  const currenciesWithVariableDecimals: CurrencyCode[] = ['KWD']

  if (currency === 'BTC') {
    return {
      minimumFractionDigits: 0,
      maximumFractionDigits: 8,
    }
  }

  if (currenciesWithZeroDecimals.includes(currency)) {
    return {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }
  }

  if (currenciesWithThreeDecimals.includes(currency)) {
    return {
      minimumFractionDigits: 0,
      maximumFractionDigits: 3,
    }
  }

  if (currenciesWithVariableDecimals.includes(currency)) {
    return {
      minimumFractionDigits: 2,
      maximumFractionDigits: 3,
    }
  }

  // Default to 2 decimals
  return {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }
}

/**
 * Calculate the number of satoshis are equally a given amount of fiat
 */
export function convertToSats(opts: {
  /**
   * Amount of fiat
   */
  amount: bigint
  currency: FiatCurrencyCode
  /**
   * The price of 1 BTC in the given currency (this comes from the price API)
   * This comes fractionated.
   */
  price: number
}) {
  const {currency, amount, price} = opts

  const priceInInt = convertToBigInt({currency, amount: price})

  return BigInt(Math.round((Number(amount) / Number(priceInInt)) * 1e8))
}

/**
 * Calculate the amount of fiat that is equally a given number of satoshis
 */
export function convertFromSats(opts: {
  /**
   * Amount of satoshis
   */
  amount: bigint
  currency: FiatCurrencyCode
  /**
   * The price of 1 BTC in the given currency (this comes from the price API)
   * This comes fractionated.
   */
  price: number
}) {
  const {currency, amount, price} = opts
  const priceInInt = convertToBigInt({currency, amount: price})

  return BigInt(Math.round((Number(amount) * Number(priceInInt)) / 1e8))
}

/**
 * Convert a amount to an integer based maintaining the number of decimal places
 * for the given currency. This is useful to avoid floating point errors.
 */
export function convertToBigInt({
  currency,
  amount,
}: {
  currency: CurrencyCode
  amount: number
}) {
  const {maximumFractionDigits} = getFractionDigits(currency)

  const fractionMultiplier = 10 ** maximumFractionDigits
  const priceInInt = Math.ceil(amount * fractionMultiplier)
  return BigInt(priceInInt)
}
