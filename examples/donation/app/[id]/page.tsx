import {bamotf} from '@/utils/bamotf'
import {notFound} from 'next/navigation'

import {env} from '../../../../env/env'
import {Subscribe} from './subscribe'

export default async function DonationQrCode({params}: {params: {id: string}}) {
  const pi = await bamotf.paymentIntents.retrieve(params.id)

  if (!pi) {
    notFound()
  }

  const developmentUrl = `http://localhost:3000/${pi.id}`
  const productionUrl = env.VERCEL_URL!
  const redirectUrl =
    env.VERCEL_ENV === 'development' ? developmentUrl : productionUrl

  return (
    <div className="">
      <Subscribe paymentIntent={pi} />
    </div>
  )
}
