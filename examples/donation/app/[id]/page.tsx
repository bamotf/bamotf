import {bamotf} from '@/utils/bamotf'
import {QRCodeSVG} from 'qrcode.react'

export default async function DonationQrCode({params}: {params: {id: string}}) {
  const pi = await bamotf.paymentIntents.retrieve(params.id)

  if (!pi) return <>Donation not found</>

  return (
    <div className="">
      {pi.amount}
      {pi.currency}
      {/* TODO: price to transfer */}
      {pi.status}
      <QRCodeSVG
        bgColor="#FFFFFF00"
        fgColor="#FFFFFFF0"
        value={`bitcoin:${pi.address}?amount=${pi.amount}&r=${
          process.env.VERCEL_URL || 'http://localhost:3000'
        }/${pi.id}/success`}
      />
      {pi.address}
    </div>
  )
}
