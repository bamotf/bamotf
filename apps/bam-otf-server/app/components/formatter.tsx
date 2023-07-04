import type {CurrencyCode} from '../../../../config/currency'

/**
 * Formats a date or an amount of money.
 */
export function Formatter(
  props:
    | {date: Date}
    | {
        amount: bigint
        currency: CurrencyCode | string
      },
) {
  // TODO: use the user's language
  const language = 'en-US'

  if ('date' in props) {
    return (
      <>
        {props.date.toLocaleString(language, {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        })}
      </>
    )
  }

  const {currency, amount} = props

  // TODO: this can probably be exported as a set of @bam-otf/react components or something
  // format like `₿ 0.00000001`
  return (
    <>
      {new Intl.NumberFormat(language, {
        style: 'currency',
        currency: currency === 'BTC' ? 'XBT' : currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: currency === 'BTC' ? 8 : 2,
      })
        .format(amount)
        .replace('XBT', '₿')}
    </>
  )
}
