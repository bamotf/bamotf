import React from 'react'
import type {PaymentIntentStatus} from '@bam-otf/node'
import {QRCodeSVG} from 'qrcode.react'

export async function PaymentInformation({
  amount,
  currency,
  status,
  address,
  label,
  message,
  redirectUrl,
}: {
  amount: number
  address: string
  status: PaymentIntentStatus
  currency: string
  label?: string
  message?: string
  redirectUrl: string
}) {
  const response = await fetch(`http://localhost:3000/api/price/${currency}`)
  const {price} = await response.json()

  // Be like: parseFloat(currency.toFraction(amount, 8))
  const btcAmount = Number(amount) / 100000000 // Convert satoshis to BTC with 8 decimal places

  const urlParams = new URLSearchParams({
    amount: btcAmount.toString(),
    label: label ? encodeURIComponent(label) : '',
    message: message ? encodeURIComponent(message) : '',
  })

  const qrCodeValue = `bitcoin:${address}?${urlParams.toString()}&r=${redirectUrl}/success`

  return (
    <>
      <div className="">
        Donating: {amount} {currency}
      </div>
      <div className="">BTC PRICE: {price}</div>
      <div className="">
        Amount to pay: {Math.ceil((amount / price) * 1e8) / 1e8}
      </div>

      <QRCodeSVG bgColor="#FFFFFF00" fgColor="#FFFFFFF0" value={qrCodeValue} />
      {address}
    </>
  )
}
