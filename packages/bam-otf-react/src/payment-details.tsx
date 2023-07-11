import React from 'react'
import {currency as currencyUtil} from '@bam-otf/utils'
import {BookOpen, Laptop, Target} from 'lucide-react'

import type {CurrencyCode} from '../../../config/currency'
import {BranchStatus} from './branch-status'
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
  amount: bigint
  /** Currency code */
  currency: CurrencyCode
  /**
   * The current price of the bitcoin
   */
  price: number
}

export function PaymentDetails({
  address,
  amount,
  currency,
  price,
  label,
  message,
  redirectUrl,
}: PaymentDetailsProps) {
  let amountInBTC = currencyUtil.toFraction({amount, currency})

  if (currency !== 'BTC') {
    // TODO: this should be probably getting the price from the endpoint instead of
    // receiving it as a prop
    const converted = currencyUtil.convertToSats({
      amount,
      currency,
      price,
    })
    amountInBTC = currencyUtil.toFraction({
      amount: converted,
      currency: 'BTC',
    })
  }

  return (
    <>
      <div className="payment-details-status">
        <BranchStatus branch="Development" />
      </div>

      <div className="payment-details">
        <h3>Payment Details</h3>
        <QRCode
          address={address}
          amount={amountInBTC}
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
          <Copyable prefix="BTC" text={amountInBTC.toString()} />
        </div>
      </div>
    </>
  )
}
