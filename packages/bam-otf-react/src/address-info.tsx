import React from 'react'

import {CopyButton} from './copy-button'

interface AddressInfoProps {
  address: string
  handleCopied: () => void
}

export function AddressInfo({address, handleCopied}: AddressInfoProps) {
  return (
    <div className="">
      Address:
      <div>
        {address} <CopyButton text={address} onCopied={handleCopied} />
      </div>
    </div>
  )
}
