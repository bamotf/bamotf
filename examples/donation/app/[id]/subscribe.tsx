'use client'

import React, {useEffect} from 'react'
import {pusherClient} from '@/utils/pusher.client'

export function Subscribe({id}: {id: string}) {
  useEffect(() => {
    const onPaymentIntentSucceeded = (data: any) => {
      console.log('🔥 ~ from webhook', {data})
    }

    pusherClient.subscribe(id)
    pusherClient.bind('payment_intent.succeeded', onPaymentIntentSucceeded)

    return () => {
      // cleanup
      pusherClient.unsubscribe(id)
      pusherClient.unbind('payment_intent.succeeded', onPaymentIntentSucceeded)
    }
  }, [id])

  return <div>Subscribe</div>
}
