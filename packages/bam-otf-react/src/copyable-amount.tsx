import React from 'react'
import {currency} from '@bam-otf/utils'

import {Copyable, type CopyableProps} from './copyable'

interface CopyableAmountProps extends Pick<CopyableProps, 'onCopied'> {
  amount: bigint
}

export function CopyableAmount({amount, onCopied}: CopyableAmountProps) {
  const btcAmount = currency.format({amount, currency: 'BTC'})

  return (
    <div className="copyable-container">
      <div className="amount-prefix">BTC</div>
      <Copyable text={btcAmount} onCopied={onCopied} />
    </div>
  )
}
