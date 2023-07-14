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
    <div className="bg-slate-100 p-4 w-64 justify-between rounded">
      <label htmlFor="currency" className="px-2">
        Select Currency:
      </label>
      <select
        name="currency"
        id="currency"
        value={currency}
        onChange={handleCurrencyChange}
        className="ml-2 px-2 py-1 border rounded-md custom-select bg-slate-200 text-neutral-900"
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
