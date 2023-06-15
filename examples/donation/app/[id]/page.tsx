import {bamotf} from '@/utils/bamotf'
import {notFound} from 'next/navigation'
import {QRCodeSVG} from 'qrcode.react'

import {Subscribe} from './subscribe'

export default async function DonationQrCode({params}: {params: {id: string}}) {
  const pi = await bamotf.paymentIntents.retrieve(params.id)

  if (!pi) {
    notFound()
  }

  const developmentUrl = `http://localhost:3000/${pi.id}`
  const productionUrl = process.env.VERCEL_URL
  const redirectUrl =
    process.env.VERCEL_ENV === 'development' ? developmentUrl : productionUrl

  return (
    <div className="">
      {pi.amount}
      {pi.currency}
      {/* TODO: price to transfer */}
      {pi.status}
      <QRCodeSVG
        bgColor="#FFFFFF00"
        fgColor="#FFFFFFF0"
        value={`bitcoin:${pi.address}?amount=${pi.amount}&r=${redirectUrl}/success`}
      />
      {pi.address}

      <Subscribe id={pi.id} />
    </div>
  )
}
