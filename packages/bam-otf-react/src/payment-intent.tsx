import React from 'react'
import {currency as currencyUtil} from '@bam-otf/utils'

import type {CurrencyCode} from '../../../config/currency'
import {CopyableAddress} from './copyable-address'
import {CopyableAmount} from './copyable-amount'
import {QRCode, type QRCodeProps} from './qr-code'

// TODO: there are duplicate types of this
export const paymentIntentStatus = {
  pending: 'pending',
  processing: 'processing',
  succeeded: 'succeeded',
  canceled: 'canceled',
}

export type PaymentIntentStatus = keyof typeof paymentIntentStatus

interface PaymentIntentProps {
  /**
   * The payment intent
   */
  intent: {
    address: string
    // TODO error with telejson, storybook and bigint type
    amount: bigint
    currency: CurrencyCode
  }

  /**
   * The current price of the bitcoin
   */
  price: number

  /**
   * Props to pass to the QRCode component
   */
  qrCodeProps?: Pick<QRCodeProps, 'label' | 'message' | 'redirectUrl'>
}

export function PaymentIntent({
  intent,
  price,
  qrCodeProps,
}: PaymentIntentProps) {
  const {amount, currency, address} = intent

  let amountInBTC = currencyUtil.toFraction({amount, currency})

  if (currency !== 'BTC') {
    // TODO: this should be probably getting the price from the endpoint instead of
    // receiving it as a prop
    amountInBTC = Math.ceil((Number(amount) / price) * 1e8) / 1e8
  }

  return (
    <div className="payment-intent">
      <QRCode address={address} amount={amountInBTC} {...qrCodeProps} />

      <div className="copyable-field">
        <label>Address</label>
        <CopyableAddress address={address} />
      </div>

      <div className="copyable-field">
        <label>Amount</label>
        <CopyableAmount amount={amountInBTC} />
      </div>
    </div>
  )
}
