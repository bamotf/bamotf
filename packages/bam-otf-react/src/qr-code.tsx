import React from 'react'
import {currency} from '@bam-otf/utils'
import {QRCodeSVG} from 'qrcode.react'

export type QRCodeProps = {
  /**
   * The bitcoin address that will receive the payment
   */
  address: string

  /**
   * The amount to be received in satoshis
   * @example
   * 10_00_000_000 // 10 BTC
   * 100000000 // 1 BTC
   * 10000000 // 0.1 BTC
   */
  amount: bigint

  /**
   * The URL to redirect to after the payment is complete
   * @example
   * https://example.com/thank-you
   */
  redirectUrl?: string

  label?: string
  message?: string
}

/**
 * Renders a QR code readable by a bitcoin wallet
 *
 * @param {QRCodeProps} props
 * @returns SVG element
 */
export function QRCode({
  address,
  amount,
  label,
  message,
  redirectUrl,
}: QRCodeProps) {
  const btcAmount = currency.toFraction({amount, currency: 'BTC'})

  let url = `bitcoin:${address}?amount=${btcAmount}`

  if (label) {
    url += `&label=${encodeURIComponent(label)}`
  }

  if (message) {
    url += `&message=${encodeURIComponent(message)}`
  }

  if (redirectUrl) {
    url += `&r=${redirectUrl}`
  }

  return (
    <QRCodeSVG bgColor="#FFF" fgColor="#000" value={url} className="qr-code" />
  )
}
