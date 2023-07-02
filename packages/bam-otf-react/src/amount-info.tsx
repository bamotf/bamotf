import React from 'react'

import {CopyButton} from './copy-button'

interface AmountInfoProps {
  btcAmount: number
  handleCopied: () => void
}

export function AmountInfo({btcAmount, handleCopied}: AmountInfoProps) {
  return (
    <div className="">
      Amount in BTC:
      <div>
        {btcAmount}{' '}
        <CopyButton text={btcAmount.toString()} onCopied={handleCopied} />
      </div>
    </div>
  )
}
