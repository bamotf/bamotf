import {bamotf} from '@/utils/bamotf'
import {notFound} from 'next/navigation'

import {Subscribe} from './subscribe'

export default async function DonationQrCode({params}: {params: {id: string}}) {
  const pi = await bamotf.paymentIntents.retrieve(params.id)

  if (!pi) {
    notFound()
  }

  return (
    <div className="">
      <Subscribe paymentIntent={pi} />
    </div>
  )
}
