import React from 'react'
import type {PaymentIntentStatus} from '@bam-otf/node'
import {QRCodeSVG} from 'qrcode.react'

export async function PaymentInformation({
  amount,
  currency,
  status,
  address,
  redirectUrl,
}: {
  amount: number
  address: string
  status: PaymentIntentStatus
  currency: string
  redirectUrl: string
}) {
  const response = await fetch(`http://localhost:3000/api/price/${currency}`)
  const {price} = await response.json()

  return (
    <>
      <div className="">
        Donating: {amount} {currency}
      </div>
      <div className="">BTC PRICE: {price}</div>
      <div className="">
        Amount to pay: {Math.ceil((amount / price) * 1e8) / 1e8}
      </div>

      <QRCodeSVG
        bgColor="#FFFFFF00"
        fgColor="#FFFFFFF0"
        value={`bitcoin:${address}?amount=${amount}&r=${redirectUrl}/success`}
      />
      {address}
    </>
  )
}
