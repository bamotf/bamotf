import {expect, test} from 'vitest'

import {CashierClient} from './client'
import {UnauthorizedError} from './errors'

test('should not have Authorization', async () => {
  const client = new CashierClient('should-fail-token')

  expect(() =>
    client.paymentIntents.create({
      amount: 9999,
      address: 'fake-address',
    }),
  ).rejects.toThrow(new UnauthorizedError('Cashier API key is invalid.'))
})

test('should hit the Payment Intent API', async () => {
  const client = new CashierClient('test-token')

  const pi = await client.paymentIntents.create({
    amount: 9999,
    // fake Bech32 bitcoin address
    address: '1Dg5jKw5bfW8uV1LbiY1YXcx7KjQPK8uV7',
  })

  expect(pi.amount).toBe(9999)
})
