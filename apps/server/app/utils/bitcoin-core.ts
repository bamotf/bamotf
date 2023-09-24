/**
 * This file contains functions that interact with the Bitcoin Core.
 * I haven't found a good library for this, so I'm using fetch.
 *
 * It's a good idea to replace this with a library that supports TypeScript.
 */

import {currency} from '@bamotf/utils'
import {fetch} from '@remix-run/node'
import {format, logger} from 'logger'

import {env} from './env.server'

export type SupportedNetworks = 'prod' | 'test'

type BitcoinCoreResponse = {
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
  network,
  method,
  params = {},
  wallet,
}: {
  network: SupportedNetworks
  method: string
  params?: object
  /**
   * Specify the wallet name to use for the command.
   */
  wallet?: string
}) {
  let url: URL

  switch (network) {
    case 'prod':
      if (!env.MAINNET_BITCOIN_CORE_URL) {
        throw new Error('MAINNET_BITCOIN_CORE_URL is not defined')
      }
      url = env.MAINNET_BITCOIN_CORE_URL
      break
    case 'test':
      if (!env.TESTNET_BITCOIN_CORE_URL) {
        throw new Error('TESTNET_BITCOIN_CORE_URL is not defined')
      }
      url = env.TESTNET_BITCOIN_CORE_URL
      break

    default:
      throw new Error(`Invalid network '${network}'`)
  }

  const address = `${url.origin}${
    wallet ? `/wallet/${encodeURIComponent(wallet)}` : ''
  }`

  const request = await fetch(address, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + btoa(`${url.username}:${url.password}`),
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
    const message = `Failed to ${method}: ${data.error.message}`
    logger.error(message, {wallet, params})
    throw new Error(message)
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
export async function createWatchOnlyWallet({
  name,
  network,
}: {
  name: string
  network: SupportedNetworks
}) {
  logger.silly(`🟠 Creating wallet '${format.yellow(name)}'`)

  return await cmd({
    method: 'createwallet',
    params: {
      wallet_name: name,
      disable_private_keys: true,
      load_on_startup: true,
    },
    network,
  })
}

/**
 * Gets the descriptor for the given address so that it can be imported into the watch-only wallet.
 *
 * @param address A Bitcoin address
 * @returns
 */
export async function getDescriptor({
  address,
  network,
}: {
  address: string
  network: SupportedNetworks
}) {
  logger.silly(`🟠 Getting descriptor for address '${format.yellow(address)}'`)

  const result = await cmd({
    method: 'getdescriptorinfo',
    params: {descriptor: `addr(${address})`},
    network,
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
  network,
  timestamp,
}: {
  network: SupportedNetworks
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
  timestamp: Date
}) {
  logger.silly('🟠 Importing address into wallet in the Bitcoin Core')

  return await cmd({
    wallet,
    method: 'importdescriptors',
    params: {
      requests: [
        {
          desc: descriptor,
          timestamp: (timestamp.getTime() / 1000) | 0,
          label: 'test-address',
        },
      ],
    },
    network,
  })
}

/**
 * Lists all unspent transactions for the given wallet.
 * @param wallet wallet name
 * @returns
 */
export async function listUnspent(props: {
  wallet: string
  network: SupportedNetworks
}): Promise<
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
    `🟠 Requesting transactions from wallet ${format.magenta(props.wallet)}`,
  )

  return await cmd({
    method: 'listunspent',
    params: {minconf: 0},
    ...props,
  })
}

/**
 *
 * @param wallet wallet name
 * @returns
 */
export async function getBalance({
  wallet,
  network,
}: {
  wallet: string
  network: SupportedNetworks
}) {
  logger.silly(`🟠 Getting balance for wallet ${format.magenta(wallet)}`)
  const l = await listUnspent({wallet, network})
  return l
    .filter(a => a.confirmations > 0)
    .reduce((acc, curr) => acc + curr.amount, 0)
}

/**
 * Makes an onchain transaction to the given address.
 * NOTE: This is only used by the bamotf team to simulate payments during development.
 */
export async function simulatePayment({
  address,
  amount: providedAmount,
  network,
}: {
  address: string
  /**
   * Amount in satoshis
   */
  amount: bigint
  network: SupportedNetworks
}) {
  if (env.NODE_ENV !== 'test') {
    throw new Error(
      'This is only used by the bamotf team to simulate payments during development',
    )
  }

  const convertedAmount = BigInt(providedAmount)
  const amount = currency.toFraction({amount: convertedAmount, currency: 'BTC'})

  logger.silly(
    `🟠 Simulating payment of ${format.yellow(
      amount,
    )} satoshis to address ${format.cyan(address)}`,
  )

  const wallet = 'test-wallet'
  const balance = await getBalance({wallet, network})
  if (amount > balance) {
    // TODO: mine a block in order to get some funds
    throw new Error('Insufficient funds')
  }

  logger.silly(
    `🟠 Sending ${format.yellow(
      providedAmount,
    )} satoshis to address ${format.cyan(address)}`,
  )

  await cmd({
    wallet,
    method: 'sendtoaddress',
    params: {
      address,
      amount,
      fee_rate: 25,
    },
    network,
  })

  // getnewaddress from the wallet
  const testWalletAddress = await cmd({
    wallet: 'test-wallet',
    method: 'getnewaddress',
    network,
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
    network,
  })
}

/**
 * Only for testing purposes.
 * @returns
 */
export async function listWallets(network: SupportedNetworks) {
  return (await cmd({method: 'listwallets', network})) as string[]
}

/**
 * Removes the given wallet from the Bitcoin Core list of wallets.
 * @param wallet
 * @returns
 */
export function unloadWallet({
  wallet,
  network,
}: {
  wallet: string
  network: SupportedNetworks
}) {
  return cmd({
    method: 'unloadwallet',
    params: {wallet_name: wallet, load_on_startup: false},
    network,
  })
}
