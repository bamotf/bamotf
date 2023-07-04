import {bamotf} from '@/utils/bamotf'
import {notFound} from 'next/navigation'

import {PaymentFlow} from './payment-flow'

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
      <PaymentFlow paymentIntent={pi} />
    </div>
  )
}
