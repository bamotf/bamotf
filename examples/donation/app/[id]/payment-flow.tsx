'use client'

import React, {useEffect, useState} from 'react'
import {pusherClient} from '@/utils/pusher.client'
import type {PaymentIntent, PaymentIntentStatus} from '@bam-otf/node'

import {PaymentInformation} from './payment-information'

export function PaymentFlow({
  paymentIntent: pi,
}: {
  paymentIntent: PaymentIntent
}) {
  const [status, setStatus] = useState<PaymentIntentStatus>(pi.status)

  useEffect(() => {
    const onPaymentIntentProcessing = (data: any) => {
      setStatus('processing')
    }

    const onPaymentIntentSucceeded = (data: any) => {
      setStatus('succeeded')
    }

    pusherClient.subscribe(pi.id)
    pusherClient.bind('payment_intent.processing', onPaymentIntentProcessing)
    pusherClient.bind('payment_intent.succeeded', onPaymentIntentSucceeded)

    return () => {
      // cleanup
      pusherClient.unsubscribe(pi.id)
      pusherClient.unbind(
        'payment_intent.processing',
        onPaymentIntentProcessing,
      )
      pusherClient.unbind('payment_intent.succeeded', onPaymentIntentSucceeded)
    }
  }, [pi.id])

  const views = {
    // @ts-expect-error - Async component
    pending: <PaymentInformation {...pi} />,
    processing: <>processing</>,
    succeeded: <>succeeded</>,
    canceled: <>canceled</>,
  }

  return <div>{views[status]}</div>
}
