import {bamotf} from '@/utils/bamotf'
import {pusherServer} from '@/utils/pusher'
import {format, logger} from 'logger'
import {NextResponse} from 'next/server'

const secret = process.env.WEBHOOK_SECRET
if (!secret) {
  throw new Error('WEBHOOK_SECRET not set')
}

export async function POST(request: Request) {
  const rawBody = await request.text()
  const signatureHeader = request.headers.get('x-webhook-signature') || ''

  const {success, parsed} = bamotf.webhooks.constructEvent(
    rawBody,
    signatureHeader,
    secret!,
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
    case 'payment_intent.succeeded':
      // Trigger an event on the client
      pusherServer.trigger(paymentIntent.id, event, {
        ok: true,
      })

      logger.info(
        `✅ Payment intent succeeded: ${format.magenta(paymentIntent.id)}`,
      )
      return NextResponse.json({success: true})

    default:
      logger.error(format.red(`Unknown event: ${event}`))
      return NextResponse.json({success: false, error: 'Unknown event'})
  }
}
