'use client'

import type React from 'react'
import {useEffect, useState} from 'react'
import {pusherClient} from '@/utils/pusher.client'
import type {PaymentIntent, PaymentIntentStatus} from '@bamotf/node'

export function PaymentFlow({
  listenTo,
  initialStatus,
  views,
}: {
  listenTo: PaymentIntent['id']
  initialStatus: PaymentIntent['status']
  views: Record<PaymentIntentStatus, React.JSX.Element>
}) {
  const [status, setStatus] = useState<PaymentIntentStatus>(initialStatus)

  useEffect(() => {
    const onPaymentIntentProcessing = () => {
      setStatus('processing')
    }

    const onPaymentIntentSucceeded = () => {
      setStatus('succeeded')
    }

    pusherClient.subscribe(listenTo)
    pusherClient.bind('payment_intent.processing', onPaymentIntentProcessing)
    pusherClient.bind('payment_intent.succeeded', onPaymentIntentSucceeded)

    return () => {
      // cleanup
      pusherClient.unsubscribe(listenTo)
      pusherClient.unbind(
        'payment_intent.processing',
        onPaymentIntentProcessing,
      )
      pusherClient.unbind('payment_intent.succeeded', onPaymentIntentSucceeded)
    }
  }, [listenTo])

  return views[status]
}
