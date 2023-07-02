// TODO: move this to a config file

type Currency =
  | 'BTC'
  | 'USD'
  | 'BRL'
  | 'AED'
  | 'AUD'
  | 'BHD'
  | 'BMD'
  | 'CAD'
  | 'CHF'
  | 'CLP'
  | 'CZK'
  | 'DKK'
  | 'EUR'
  | 'GBP'
  | 'HKD'
  | 'HUF'
  | 'IDR'
  | 'ILS'
  | 'INR'
  | 'KRW'
  | 'LKR'
  | 'MXN'
  | 'MYR'
  | 'NGN'
  | 'NOK'
  | 'NZD'
  | 'PHP'
  | 'PKR'
  | 'PLN'
  | 'RUB'
  | 'SAR'
  | 'SEK'
  | 'SGD'
  | 'THB'
  | 'TRY'
  | 'TWD'
  | 'ZAR'
  | 'JPY'
  | 'MMK'
  | 'VND'
  | 'BDT'
  | 'KWD'

type FormatOpts = {
  amount: bigint
  currency: Currency
}

export function format(opts: FormatOpts, locale?: string): string {
  const {amount, currency} = opts
  const fractions = getFractionDigits(currency)
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    ...fractions,
  })

  const formattedAmount = formatter.format(
    Number(toFraction({amount, currency})),
  )

  return formattedAmount
}

type FractionOpts = {
  amount: bigint
  currency: Currency
}

export function toFraction(opts: FractionOpts) {
  const {amount, currency} = opts
  const {maximumFractionDigits} = getFractionDigits(currency)

  return amount / BigInt(10) ** BigInt(maximumFractionDigits)
}

export function getFractionDigits(currency: Currency): {
  minimumFractionDigits: number
  maximumFractionDigits: number
} {
  const currenciesWithZeroDecimals: Currency[] = ['JPY', 'MMK', 'VND']
  const currenciesWithThreeDecimals: Currency[] = ['BDT']
  const currenciesWithVariableDecimals: Currency[] = ['KWD']

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
