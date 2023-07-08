import React, {useState} from 'react'

import {CURRENCY_CODES, type CurrencyCode} from '../../../config/currency'

interface CurrencySelectorProps {
  selectedCurrency: CurrencyCode
  onCurrencyChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
}

export function CurrencySelector({
  selectedCurrency,
  onCurrencyChange,
}: CurrencySelectorProps) {
  const [currency, setCurrency] = useState<CurrencyCode>(selectedCurrency)

  const handleCurrencyChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const newCurrency = event.target.value as CurrencyCode
    if (CURRENCY_CODES.includes(newCurrency)) {
      setCurrency(newCurrency)
      onCurrencyChange(event)
    }
  }

  return (
    <div>
      <label htmlFor="currency">Select Currency:</label>
      <select
        name="currency"
        id="currency"
        value={currency}
        onChange={handleCurrencyChange}
        className="ml-2 px-2 py-1 border rounded-md custom-select"
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
