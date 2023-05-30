import {describe, expect, test} from 'vitest'
import * as bitcoinCore from './bitcoin-core'
import {env} from './env.server'

describe('bitcoin', () => {
  test('createWatchOnlyWallet', async () => {
    const wallet = await bitcoinCore.createWatchOnlyWallet('wilson')

    expect(wallet).toEqual(
      expect.objectContaining({
        name: 'wilson',
      }),
    )
  })

  test('getDescriptor', async () => {
    const descriptor = await bitcoinCore.getDescriptor(
      'bcrt1qtfjrpdwcxa7et498ead2gwxrnscl8eaaxvdxzp',
    )

    expect(descriptor).toEqual(
      'addr(bcrt1qtfjrpdwcxa7et498ead2gwxrnscl8eaaxvdxzp)#hjw9tktm',
    )
  })

  test('addWatchOnlyAddress', async () => {
    const [{success}] = await bitcoinCore.addWatchOnlyAddress({
      descriptor: 'addr(bcrt1qtfjrpdwcxa7et498ead2gwxrnscl8eaaxvdxzp)#hjw9tktm',
      wallet: 'fake-wallet',
    })

    expect(success).toBeTruthy()
  })
})
