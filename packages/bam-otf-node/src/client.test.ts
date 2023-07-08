import {expect, test} from 'vitest'

import {BamOtf} from './client'
import {UnauthorizedError} from './errors'

test('should not have Authorization', async () => {
  const client = new BamOtf('should-fail-token')

  expect(() =>
    client.paymentIntents.create({
      amount: 9999n,
      address: 'fake-address',
    }),
  ).rejects.toThrow(new UnauthorizedError('bam-otf API key is invalid.'))
})

test('should hit the Payment Intent API', async () => {
  const client = new BamOtf('test-token')

  const pi = await client.paymentIntents.create({
    amount: 9999n,
    address: '1Dg5jKw5bfW8uV1LbiY1YXcx7KjQPK8uV7',
  })

  expect(pi.amount).toBe(9999n)
})
