import {symmetric} from 'secure-webhooks'

import type {WebhookEvent} from './types'

/**
 * Build a webhook event from a raw body and a signature header
 *
 * @param webhookRawBody Make sure to disable any body parsing before passing the raw body
 * @param webhookSignatureHeader
 * @param webhookSecret
 * @returns
 */
export function constructEvent(
  webhookRawBody: string,
  webhookSignatureHeader: string,
  webhookSecret: string,
) {
  const isTrustWorthy = symmetric.verify(
    webhookRawBody,
    webhookSecret,
    webhookSignatureHeader,
  )

  if (!isTrustWorthy) {
    return {
      success: false,
    } as const
  }

  // TODO: parse data from webhookRawBody so that it comes with the correct type
  const webhookEvent = JSON.parse(webhookRawBody)

  return {
    success: true,
    parsed: webhookEvent as WebhookEvent,
  } as const
}

/**
 * Generate a test header string so you can mock a webhook event that comes from *bamotf* server
 *
 * @param payload
 * @param secret
 * @returns
 */
export function generateTestHeaderString(payload: string, secret: string) {
  return symmetric.sign(payload, secret)
}
