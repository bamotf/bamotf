import {expect, test} from 'vitest'

import {CashierClient} from './index'

test('should not have Authorization', async () => {
  const client = new CashierClient('fake-token')

  const pi = await client.paymentIntents.create({
    amount: 9999,
    address: 'fake-address',
  })

  expect(pi.status).toBe(401)
  // @ts-ignore
  expect(pi.body).toContain('permission')
})

test('should hit the Payment Intent API', async () => {
  const client = new CashierClient('test-token')

  const pi = await client.paymentIntents.create({
    amount: 9999,
    // fake Bech32 bitcoin address
    address: '1Dg5jKw5bfW8uV1LbiY1YXcx7KjQPK8uV7',
  })

  expect(pi.status).toBe(200)
  // @ts-ignore
  expect(pi.body.amount).toBe(9999)
})
