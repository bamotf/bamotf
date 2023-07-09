import React from 'react'
import {env} from '@/utils/env'

import type {CurrencyCode} from '../../../../config/currency'
import {PaymentIntent} from './payment-information'

async function getPrice(currency: CurrencyCode) {
  const response = await fetch(`http://localhost:4000/api/price/${currency}`)
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
  currency: CurrencyCode
}) {
  const developmentUrl = `http://localhost:4000/${id}`
  const productionUrl = `${env.VERCEL_URL!}/${id}`
  const redirectUrl =
    env.VERCEL_ENV === 'development' ? developmentUrl : productionUrl

  const price = await getPrice(currency)
  return (
    <div>
      <PaymentIntent
        intent={{amount, currency, address}}
        price={price}
        qrCodeProps={{label: '', message: '', redirectUrl}}
      />
    </div>
  )
}
