import React from 'react'

export type WalletRedirectUrl = string

interface OpenInWalletButtonProps {
  redirectUrl: WalletRedirectUrl
}

export function OpenInWalletButton({redirectUrl}: OpenInWalletButtonProps) {
  const handleOpenInWalletClick = () => {
    window.open(redirectUrl, '_blank')
  }

  return (
    <button className="open-in-wallet-button" onClick={handleOpenInWalletClick}>
      Open in wallet
    </button>
  )
}
