import {bamotf} from '@/utils/bamotf'
import {notFound} from 'next/navigation'

import {Subscribe} from './subscribe'

export default async function DonationQrCode({params}: {params: {id: string}}) {
  const pi = await bamotf.paymentIntents.retrieve(params.id)

  if (!pi) {
    notFound()
  }

  const developmentUrl = `http://localhost:3000/${pi.id}`
  const productionUrl = process.env.VERCEL_URL!
  const redirectUrl =
    process.env.VERCEL_ENV === 'development' ? developmentUrl : productionUrl

  return (
    <div className="">
      <Subscribe paymentIntent={pi} redirectUrl={redirectUrl} />
    </div>
  )
}
