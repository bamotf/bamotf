import {expect, test} from 'tests/base.fixture'
import {prisma} from '~/utils/prisma.server'

// TODO: move this to a utils file
function createFakePaymentIntent(props?: {amount?: number; address?: string}) {
  const {amount = 100, address = '1Dg5jKw5bfW8uV1LbiY1YXcx7KjQPK8uV7'} =
    props || {}
  return prisma.paymentIntent.create({
    data: {
      amount: amount,
      address,
    },
  })
}

test.describe('[POST] /api/payment-intents/:id/cancel', () => {
  test('should respond with a 200 status code', async ({request}) => {
    // Create a fake payment intent
    const {id} = await createFakePaymentIntent()

    // Cancel the payment intent
    const pi = await request.post(`/api/payment-intents/${id}/cancel`)

    // Check that the response is correct
    expect(pi.ok()).toBeTruthy()
    expect(await pi.json()).toStrictEqual(
      expect.objectContaining({
        status: 'canceled',
      }),
    )
  })
})
