import React from 'react'
import {env} from '@/utils/env'

import {PaymentDetails} from './payment-details'

/**
 * Get the BTC price in USD from the bamotf server
 * @param currency
 * @returns
 */
async function getPrice(currency: string) {
  const response = await fetch(`${env.BAMOTF_SERVER_URL}/api/price/${currency}`)
  const {price} = await response.json()
  return price
}

export async function PaymentPending({
  id,
  amount,
  currency,
  address,
}: {
  id: string
  amount: bigint
  address: string
  currency: string
}) {
  const developmentUrl = `http://localhost:4000/${id}`
  const productionUrl = `${env.VERCEL_URL!}/${id}`
  const redirectUrl =
    env.VERCEL_ENV === 'development' ? developmentUrl : productionUrl

  const price = await getPrice(currency)
  return (
    <PaymentDetails
      amount={amount}
      currency={currency}
      address={address}
      price={price}
      label="Donation to bamotf"
      message="Thank you for your donation!"
      redirectUrl={redirectUrl}
    />
  )
}
