/**
 * This file contains functions that interact with the Bitcoin Core.
 * I haven't found a good library for this, so I'm using fetch.
 *
 * It's a good idea to replace this with a library that supports TypeScript.
 */

import {fetch} from '@remix-run/node'
import {format, logger} from 'logger'
import {env} from './env.server'

const BITCOIN_CORE_URL = `${env.BITCOIN_CORE_CONNECTION_STRING.protocol}://${env.BITCOIN_CORE_CONNECTION_STRING.host}`

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
 * Abstracts the Bitcoin Core RPC calls.
 */
async function cmd({
  method,
  params = {},
  wallet,
}: {
  method: string
  params?: object
  /**
   * Specify the wallet name to use for the command.
   */
  wallet?: string
}) {
  const address = `${BITCOIN_CORE_URL}${
    wallet ? `/wallet/${encodeURIComponent(wallet)}` : ''
  }`
  const request = await fetch(address, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        'Basic ' +
        btoa(
          `${env.BITCOIN_CORE_CONNECTION_STRING.user}:${env.BITCOIN_CORE_CONNECTION_STRING.password}`,
        ),
    },
    body: JSON.stringify({
      jsonrpc: '1.0',
      id: `${method}-${Date.now()}`,
      method,
      params,
    }),
  })

  const data = (await request.json()) as BitcoinCoreResponse

  if (data.error) {
    throw new Error(`Failed to ${method}: ${data.error.message}`)
  }

  return data.result
}

/**
 *  Creates a watch-only wallet with the given name.
 * Wallets are created with private keys disabled by default.
 *
 * @param name
 * @returns
 */
export async function createWatchOnlyWallet(name: string) {
  logger.silly(`🟠 Creating wallet '${format.yellow(name)}'`)

  return await cmd({
    method: 'createwallet',
    params: {
      wallet_name: name,
      disable_private_keys: true,
    },
  })
}

/**
 * Gets the descriptor for the given address so that it can be imported into the watch-only wallet.
 *
 * @param address A Bitcoin address
 * @returns
 */
export async function getDescriptor(address: string) {
  logger.silly(`🟠 Getting descriptor for address '${format.yellow(address)}'`)

  const result = await cmd({
    method: 'getdescriptorinfo',
    params: {descriptor: `addr(${address})`},
  })

  return result.descriptor as string
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
  logger.silly('🟠 Importing address into wallet in the Bitcoin Core')

  return await cmd({
    wallet,
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
}

/**
 * Lists all unspent transactions for the given wallet.
 * @param wallet wallet name
 * @returns
 */
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
    `🟠 Requesting transactions from wallet ${format.magenta(wallet)}`,
  )

  return await cmd({
    method: 'listunspent',
    wallet,
  })
}

/**
 *
 * @param wallet wallet name
 * @returns
 */
export async function getBalance(wallet: string) {
  logger.silly(`🟠 Getting balance for wallet ${format.magenta(wallet)}`)
  const l = await listUnspent(wallet)
  return l
    .filter(a => a.confirmations > 0)
    .reduce((acc, curr) => acc + curr.amount, 0)
}

/**
 * Simulates a payment to the given address.
 */
export async function simulatePayment({
  address,
  amount,
}: {
  address: string
  /**
   * Amount in satoshis
   */
  amount: number
}) {
  logger.silly(
    `🟠 Simulating payment of ${format.yellow(
      amount,
    )} satoshis to address ${format.magenta(address)}`,
  )

  const wallet = 'test-wallet'
  const balance = await getBalance(wallet)
  if (amount < balance) {
    // TODO: mine a block in order to get some funds
    throw new Error('Insufficient funds')
  }

  logger.silly(
    `🟠 Sending ${format.yellow(amount)} satoshis to address ${format.magenta(
      address,
    )}`,
  )

  await cmd({
    wallet,
    method: 'sendtoaddress',
    params: {
      address,
      amount: amount / 100_000_000,
      fee_rate: 25,
    },
  })

  // getnewaddress from the wallet
  const testWalletAddress = await cmd({
    wallet: 'test-wallet',
    method: 'getnewaddress',
  })
  logger.silly(
    `🟠 Mining a block to get the funds to the test wallet ${format.magenta(
      testWalletAddress,
    )}`,
  )

  // mine a block
  await cmd({
    method: 'generatetoaddress',
    params: {
      nblocks: 1,
      address: testWalletAddress,
    },
  })
}

/**
 * Only for testing purposes.
 * @returns
 */
export async function listWallets() {
  return (await cmd({method: 'listwallets'})) as string[]
}

/**
 * Only for testing purposes.
 * @param wallet
 * @returns
 */
export function unloadWallet(wallet: string) {
  return cmd({method: 'unloadwallet', params: {wallet_name: wallet}})
}