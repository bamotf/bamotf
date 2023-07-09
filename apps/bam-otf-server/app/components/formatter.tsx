import {currency as currencyUtils} from '@bam-otf/utils'

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

  return (
    <>
      {currencyUtils.format(language, {
        amount,
        currency: currency as CurrencyCode,
        style: 'currency',
      })}
    </>
  )
}
