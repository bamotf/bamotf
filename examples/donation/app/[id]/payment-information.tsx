import React, {useEffect, useState} from 'react'
import type {PaymentIntentStatus} from '@bam-otf/node'

import {PaymentIntent} from './payment-intent'

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

  return (
    <PaymentIntent
      intent={{amount, currency, status, address, label, message, redirectUrl}}
      price={price}
    />
  )
}
