import {bamotf} from '@/utils/bamotf'
import {env} from '@/utils/env'
import {pusherServer} from '@/utils/pusher.server'
import {NextResponse} from 'next/server'

export async function POST(request: Request) {
  const rawBody = await request.text()
  const signatureHeader = request.headers.get('x-webhook-signature') || ''

  const secret = env.BAMOTF_WEBHOOK_SECRET!
  const {success, parsed} = bamotf.webhooks.constructEvent(
    rawBody,
    signatureHeader,
    secret,
  )

  if (!success) {
    return NextResponse.json(
      {success: false, error: 'Invalid signature'},
      {status: 401, statusText: 'Unauthorized'},
    )
  }

  const {
    event,
    data: {paymentIntent},
  } = parsed

  switch (event) {
    case 'payment_intent.processing':
    case 'payment_intent.succeeded':
      // Trigger an event on the client
      await pusherServer.trigger(paymentIntent.id, event, {
        ok: true,
      })

      return NextResponse.json({success: true})

    default:
      return NextResponse.json({success: false, error: 'Unknown event'})
  }
}
