import {type PaymentIntentStatus} from '~/utils/prisma.server'

type PaymentIntentEvents = `payment_intent.${PaymentIntentStatus}`

/**
 * The event type that we send to the webhook.
 */
export type Event = PaymentIntentEvents
