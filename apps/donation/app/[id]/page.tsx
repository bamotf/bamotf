import React from 'react'
import {bamotf} from '@/utils/bamotf'
import {notFound} from 'next/navigation'

import {PaymentFlow} from './payment-flow'
import {PaymentPending} from './payment-pending'

export default async function DonationStatusPage({
  params,
}: {
  params: {id: string}
}) {
  const pi = await bamotf.paymentIntents.retrieve(params.id)

  if (!pi) {
    notFound()
  }

  return (
    <div className="">
      <PaymentFlow
        initialStatus={pi.status}
        listenTo={pi.id}
        views={{
          // @ts-ignore - TODO: fix this
          pending: <PaymentPending {...pi} />,
          processing: <>processing</>,
          succeeded: <>succeeded</>,
          canceled: <>canceled</>,
        }}
      />
    </div>
  )
}
