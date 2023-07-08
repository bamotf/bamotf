import React from 'react'

import type { CurrencyCode} from '../../../config/currency';
import {CURRENCY_CODES} from '../../../config/currency'

interface CurrencySelectorProps {
  selectedCurrency: CurrencyCode
  onCurrencyChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
}

export function CurrencySelector({
  selectedCurrency,
  onCurrencyChange,
}: CurrencySelectorProps) {
  return (
    <div>
      <label htmlFor="currency">Select Currency:</label>
      <select
        name="currency"
        id="currency"
        value={selectedCurrency}
        onChange={onCurrencyChange}
        className="ml-2 px-2 py-1 border rounded-md"
      >
        {CURRENCY_CODES.map(currency => (
          <option key={currency} value={currency}>
            {currency}
          </option>
        ))}
      </select>
    </div>
  )
}
