import React from 'react'
import {bamotf} from '@/utils/bamotf'
import {env} from '@/utils/env'

import type {CurrencyCode} from '../../../../config/currency'
import {PaymentDetails} from './payment-details'

export async function PaymentPending(props: {
  id: string
  amount: bigint
  address: string
  currency: CurrencyCode
}) {
  const {id, address, ...rest} = props
  const developmentUrl = `http://localhost:4000/${id}`
  const productionUrl = `${env.VERCEL_URL!}/${id}`
  const redirectUrl =
    env.VERCEL_ENV === 'development' ? developmentUrl : productionUrl

  const payableAmount = await bamotf.currency.toBitcoin(rest)

  return (
    <div>
      <PaymentDetails
        amount={payableAmount}
        address={address}
        label="Donation to bamotf"
        message="Thank you for your donation!"
        redirectUrl={redirectUrl}
      />
    </div>
  )
}
