import {expect, test} from 'vitest'

import {
  addWatchOnlyAddress,
  createWatchOnlyWallet,
  getBalance,
  getDescriptor,
} from './bitcoin-core'

test('createWatchOnlyWallet', async () => {
  const wallet = await createWatchOnlyWallet('wilson')

  expect(wallet).toEqual(
    expect.objectContaining({
      name: 'wilson',
    }),
  )
})

test('getDescriptor', async () => {
  const descriptor = await getDescriptor(
    'bcrt1qtfjrpdwcxa7et498ead2gwxrnscl8eaaxvdxzp',
  )

  expect(descriptor).toEqual(
    'addr(bcrt1qtfjrpdwcxa7et498ead2gwxrnscl8eaaxvdxzp)#hjw9tktm',
  )
})

test('addWatchOnlyAddress', async () => {
  const [{success}] = await addWatchOnlyAddress({
    descriptor: 'addr(bcrt1qtfjrpdwcxa7et498ead2gwxrnscl8eaaxvdxzp)#hjw9tktm',
    wallet: 'fake-wallet',
  })

  expect(success).toBeTruthy()
})

test('getBalance', async () => {
  const balance = await getBalance('test-wallet')
  expect(balance).toEqual(expect.any(Number))
})
