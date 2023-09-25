import React from 'react'
import {currency as currencyUtil} from '@bamotf/utils'

import {Copyable} from './copyable'
import {QRCode, type QRCodeProps} from './qr-code'

// TODO: there are duplicate types of this
export const paymentIntentStatus = {
  pending: 'pending',
  processing: 'processing',
  succeeded: 'succeeded',
  canceled: 'canceled',
}

export type PaymentIntentStatus = keyof typeof paymentIntentStatus

export interface PaymentDetailsProps
  extends Pick<QRCodeProps, 'label' | 'message' | 'redirectUrl'> {
  /** Address where the payment should be sent */
  address: string
  /** Amount of the payment returned from the server */
  amount: number
}

/**
 * Renders the payment details for a payment intent.
 * Users can copy the address and amount to their clipboard or scan the QR code.
 */
export function PaymentDetails({
  address,
  amount,
  label,
  message,
  redirectUrl,
}: PaymentDetailsProps) {
  return (
    <div className="payment-details">
      <h3>Payment Details</h3>
      <QRCode
        address={address}
        amount={amount}
        label={label}
        message={message}
        redirectUrl={redirectUrl}
      />

      <div className="copyable-field">
        <label>Address</label>
        <Copyable text={address} />
      </div>

      <div className="copyable-field">
        <label>Amount</label>
        <Copyable prefix="BTC" text={amount.toString()} />
      </div>
    </div>
  )
}
