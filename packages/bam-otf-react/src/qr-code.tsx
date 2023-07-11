import React from 'react'
import {QRCodeSVG} from 'qrcode.react'

export type QRCodeProps = {
  /**
   * The bitcoin address that will receive the payment
   */
  address: string

  /**
   * The amount to be received in Bitcoins
   *
   * @example
   * 10.00_000_000 // 10 BTC
   * 100000000 // 1 BTC
   * 0.10000000 // 0.1 BTC
   */
  amount: number

  /**
   * The URL to redirect to after the payment is complete
   *
   * @example
   * https://example.com/thank-you
   */
  redirectUrl?: string

  /**
   * A label to be shown in the wallet
   *
   * @example
   * order 12345
   */
  label?: string

  /**
   * A message to be shown in the wallet
   *
   * @example
   * For delivery between 9 a.m. and 5 p.m.
   */
  message?: string
}

/**
 * Renders a QR code readable by a bitcoin wallet
 */
export function QRCode({
  address,
  amount,
  label,
  message,
  redirectUrl,
}: QRCodeProps) {
  let url = `bitcoin:${address}?amount=${amount}`

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
    <a href={url}>
      <QRCodeSVG
        bgColor="#ffffff00"
        fgColor="current"
        value={url}
        size={420}
        level="M"
        className="qr-code"
        style={{
          width: '100%',
          height: 'auto',
        }}
      />
    </a>
  )
}
