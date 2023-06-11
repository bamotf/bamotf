import {expect, test} from 'vitest'

import {BamOtf} from './index'

test('should not have Authorization', async () => {
  const client = new BamOtf('fake-token')

  const pi = await client.paymentIntents.create({
    amount: 9999,
    address: 'fake-address',
  })

  expect(pi.status).toBe(401)
  // @ts-ignore
  expect(pi.body).toContain('permission')
})

test('should hit the Payment Intent API', async () => {
  const client = new BamOtf('test-token')

  const pi = await client.paymentIntents.create({
    amount: 9999,
    address: '1Dg5jKw5bfW8uV1LbiY1YXcx7KjQPK8uV7',
  })

  expect(pi.status).toBe(200)
  // @ts-ignore
  expect(pi.body.amount).toBe(9999)
})
