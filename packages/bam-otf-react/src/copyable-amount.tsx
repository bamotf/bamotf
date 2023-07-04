import React from 'react'

import {Copyable, type CopyableProps} from './copyable'

interface CopyableAmountProps extends Pick<CopyableProps, 'onCopied'> {
  amount: number
}

export function CopyableAmount({amount, onCopied}: CopyableAmountProps) {
  return (
    <div className="copyable-container">
      <div className="amount-prefix">BTC</div>
      <Copyable text={amount.toString()} onCopied={onCopied} />
    </div>
  )
}
