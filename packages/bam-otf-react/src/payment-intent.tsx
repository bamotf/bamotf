import React, {useEffect, useState} from 'react'

import {AddressInfo} from './address-info'
import {AmountInfo} from './amount-info'
import {CopyButton} from './copy-button'
import {DonationInfo} from './donation-info'
import {QRCode} from './qr-code'

export const paymentIntentStatus = {
  pending: 'pending',
  processing: 'processing',
  succeeded: 'succeeded',
  canceled: 'canceled',
}

export type PaymentIntentStatus = keyof typeof paymentIntentStatus

interface PaymentIntentProps {
  intent: {
    amount: number
    currency: string
    status: PaymentIntentStatus
    address: string
    label?: string
    message?: string
    redirectUrl: string
  }
  price: number
}

const fetchBtcAmount = async (
  amount: number,
  currency: string,
  price: number,
) => {
  const response = await fetch(`http://localhost:3000/api/price/${currency}`)
  const {price: fetchedPrice} = await response.json()
  const btcAmount = Math.ceil((amount / fetchedPrice) * 1e8) / 1e8 // Convert satoshis to BTC with 8 decimal places
  return btcAmount
}

export function PaymentIntent({intent, price}: PaymentIntentProps) {
  const {amount, currency, status, address, label, message, redirectUrl} =
    intent
  const [btcAmount, setBtcAmount] = useState(0)

  useEffect(() => {
    const fetchAmount = async () => {
      const btcAmount = await fetchBtcAmount(amount, currency, price)
      setBtcAmount(btcAmount)
    }

    fetchAmount()
  }, [amount, currency, price])

  const urlParams = new URLSearchParams({
    amount: btcAmount.toString(),
    label: label ? encodeURIComponent(label) : '',
    message: message ? encodeURIComponent(message) : '',
  })

  const qrCodeValue = `bitcoin:${address}?${urlParams.toString()}&r=${redirectUrl}/success`

  const handleCopied = () => {
    console.log('Address copied!')
  }

  return (
    <>
      <DonationInfo
        amount={amount}
        currency={currency}
        price={price}
        btcAmount={btcAmount}
      />

      <QRCode bgColor="#FFFFFF00" fgColor="#FFFFFFF0" value={qrCodeValue} />

      <AddressInfo address={address} handleCopied={handleCopied} />

      <AmountInfo btcAmount={btcAmount} handleCopied={handleCopied} />

      <CopyButton text={address} onCopied={handleCopied} />
    </>
  )
}
