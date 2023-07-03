import React from 'react'
import {env} from '@/utils/env'
import {PaymentIntent} from '@bam-otf/react'

export async function PaymentInformation({
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

  const response = await fetch(`http://localhost:3000/api/price/${currency}`)
  const {price} = await response.json()
  return (
    <PaymentIntent
      intent={{amount, currency, address}}
      price={price}
      qrCodeProps={{label: '', message: '', redirectUrl}}
    />
  )
}
