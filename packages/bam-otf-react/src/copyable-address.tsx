import React from 'react'

import {Copyable, type CopyableProps} from './copyable'

interface CopyableAddressProps extends Pick<CopyableProps, 'onCopied'> {
  address: string
}

export function CopyableAddress({address, onCopied}: CopyableAddressProps) {
  return (
    <div className="copyable-container">
      <Copyable text={address} onCopied={onCopied} />
    </div>
  )
}
