import {bamotf} from '@/utils/bamotf'
import {pusherServer} from '@/utils/pusher.server'
import {format, logger} from 'logger'
import {NextResponse} from 'next/server'

export async function POST(request: Request) {
  // FIX: rawBody is not raw exactly
  const rawBody = await request.text()
  const signatureHeader = request.headers.get('x-webhook-signature') || ''
  logger.info(`🫡 Webhook triggered`, {signatureHeader, rawBody})

  const secret = process.env.WEBHOOK_SECRET!
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

  logger.debug(`- parsed data`, parsed)

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
