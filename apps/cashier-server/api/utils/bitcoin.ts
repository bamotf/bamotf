/**
 * Most of this file can be replaced with BDK but for now this is good enough.
 * The idea is to keep dependencies to a minimum.
 */

import {env} from './env'
import fetch from 'node-fetch'

const BITCOIN_CORE_URL = `${env.BITCOIN_CORE_CONNECTION_STRING.protocol}://${env.BITCOIN_CORE_CONNECTION_STRING.host}`

const headers = {
  'Content-Type': 'application/json',
  Authorization:
    'Basic ' +
    btoa(
      `${env.BITCOIN_CORE_CONNECTION_STRING.user}:${env.BITCOIN_CORE_CONNECTION_STRING.password}`,
    ),
}

type BitcoinCoreResponse =
  | {
      id: string
    } & (
      | {
          result: null
          error: {
            code: number
            message: string
          }
        }
      | {
          result: any
          error: null
        }
    )

/**
 *  Creates a watch-only wallet with the given name.
 * Wallets are created with private keys disabled by default.
 *
 * @param name
 * @returns
 */
export async function createWatchOnlyWallet(name: string) {
  const request = await fetch(BITCOIN_CORE_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      jsonrpc: '1.0',
      id: `create-wallet-${name}`,
      method: 'createwallet',
      params: {
        wallet_name: name,
        disable_private_keys: true,
      },
    }),
  })

  if (!request.ok) {
    throw new Error(`Failed to create wallet: ${request.statusText}`)
  }

  const data = (await request.json()) as BitcoinCoreResponse

  if (data.error) {
    throw new Error(`Failed to create wallet: ${data.error.message}`)
  }

  return data.result
}

export async function getDescriptor(address: string) {
  const request = await fetch(BITCOIN_CORE_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      jsonrpc: '1.0',
      id: `get-desc-${address}`,
      method: 'getdescriptorinfo',
      params: {descriptor: `addr(${address})`},
    }),
  })

  if (!request.ok) {
    throw new Error(`Failed to get a descriptor: ${request.statusText}`)
  }

  const data = (await request.json()) as BitcoinCoreResponse

  if (data.error) {
    throw new Error(`Failed to get a descriptor: ${data.error.message}`)
  }

  return data.result.descriptor
}

/**
 * Adds a watch-only address to the watch-only wallet.
 * @param params
 */
export async function addWatchOnlyAddress({
  wallet,
  descriptor,
}: {
  /**
   * The wallet name
   */
  wallet: string
  /**
   * The descriptor to import into the wallet
   * @example 'addr(bcrt1qtfjrpdwcxa7et498ead2gwxrnscl8eaaxvdxzp)#hjw9tktm'
   * @see https://bitcoincore.org/en/doc/0.21.0/rpc/wallet/importdescriptors/
   */
  descriptor: string
}) {
  const body = JSON.stringify({
    jsonrpc: '1.0',
    id: `import-desc-${wallet}`,
    method: 'importdescriptors',
    params: {
      requests: [
        {
          desc: descriptor,
          timestamp: 'now',
          label: 'test-address',
        },
      ],
    },
  })

  const request = await fetch(
    `${BITCOIN_CORE_URL}/wallet/${encodeURIComponent(wallet)}`,
    {
      method: 'POST',
      headers,
      body,
    },
  )

  if (!request.ok) {
    throw new Error(`Failed to add address to wallet: ${request.statusText}`)
  }

  const data = (await request.json()) as BitcoinCoreResponse

  if (data.error) {
    throw new Error(`Failed to add address to wallet: ${data.error.message}`)
  }

  return data.result
}
