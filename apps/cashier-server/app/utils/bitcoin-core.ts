/**
 * Most of this file can be replaced with BDK but for now this is good enough.
 * The idea is to keep dependencies to a minimum.
 * Also, this is a temporary solution until we have a better way to handle the communication
 */

import {logger, format} from 'logger'
import {env} from './env.server'
import {fetch} from '@remix-run/node'

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
  logger.silly(`🟠 Creating wallet '${format.yellow(name)}'`)

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
  logger.silly(`🟠 Getting descriptor for address '${format.yellow(address)}'`)

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

  return data.result.descriptor as string
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
  logger.silly('🟠 Importing address into wallet in the Bitcoin Core', {body})

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

export async function listUnspent(wallet: string): Promise<
  {
    txid: string
    vout: number
    address: string
    label: string
    scriptPubKey: string
    amount: number
    confirmations: number
    spendable: boolean
    solvable: boolean
    parent_descs: string[]
    safe: boolean
  }[]
> {
  logger.silly(
    `🟠 Requesting transactions from wallet ${format.yellow(wallet)}`,
  )

  const url = `${BITCOIN_CORE_URL}/wallet/${encodeURIComponent(wallet)}`
  const request = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      jsonrpc: '1.0',
      id: `listunspent-${wallet}`,
      method: 'listunspent',
      params: {},
    }),
  })

  if (!request.ok) {
    throw new Error(`Failed to list unspent: ${request.statusText}`)
  }

  const data = (await request.json()) as BitcoinCoreResponse

  if (data.error) {
    throw new Error(`Failed to list unspent: ${data.error.message}`)
  }

  return data.result
}

/**
 * Simulates a payment to the given address.
 *
 * - [ ] Transferir atraves da carteira padrao.
 * - [ ] Checar se a cateira tem saldo suficiente.
 * - [ ] caso nao tenha, minerar o bloco apontando ela
 * - [ ] transferir
 */
export async function simulatePayment({
  address,
  amount,
}: {
  address: string
  amount: number
}) {
  // O problema que tenho eh o seguinte, vou conseguir recuperar o saldo da carteira
  // se por algum motivo a wallet nao estiver carregada.
}
