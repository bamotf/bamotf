import type {CurrencyCode} from '~/config/currency'

export const useFormattedAmount = ({
  amount,
  currency,
}: {
  amount: number
  currency: CurrencyCode | string
}) => {
  const language = 'en-US'

  // format like `₿ 0.00000001`
  return new Intl.NumberFormat(language, {
    style: 'currency',
    currency: currency === 'BTC' ? 'XBT' : currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: currency === 'BTC' ? 8 : 2,
  })
    .format(amount)
    .replace('XBT', '₿')
}
