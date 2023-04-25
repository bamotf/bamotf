import {describe, expect, test} from 'vitest'
import * as bitcoin from './bitcoin'
import {env} from './env'

describe('bitcoin', () => {
  test('createWatchOnlyWallet', async () => {
    const wallet = await bitcoin.createWatchOnlyWallet('wilson')

    expect(wallet).toEqual(
      expect.objectContaining({
        name: 'wilson',
      }),
    )
  })

  test('getDescriptor', async () => {
    const descriptor = await bitcoin.getDescriptor(
      'bcrt1qtfjrpdwcxa7et498ead2gwxrnscl8eaaxvdxzp',
    )

    expect(descriptor).toEqual(
      'addr(bcrt1qtfjrpdwcxa7et498ead2gwxrnscl8eaaxvdxzp)#hjw9tktm',
    )
  })

  test('addWatchOnlyAddress', async () => {
    const [{success}] = await bitcoin.addWatchOnlyAddress({
      descriptor: 'addr(bcrt1qtfjrpdwcxa7et498ead2gwxrnscl8eaaxvdxzp)#hjw9tktm',
      wallet: 'fake-wallet',
    })

    expect(success).toBeTruthy()
  })
})
