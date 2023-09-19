// @ts-expect-error - this lib doesn't have any type definition
import {addressFromExtPubKey} from '@swan-bitcoin/xpub-lib'

/**
 * Derive a bitcoin address from an Extended Public Key (XPUB) at a given index and
 * environment. Since the addresses can very between networks, the environment
 * is used to determine which network to derive the address on.
 *
 * @param xpub An extended public key
 * @param index The index of the address to derive
 * @param environment The network to derive the address on. Defaults to 'development'
 * @returns
 */
export function derive(
  xpub: string,
  index: number,
  environment: 'development' | 'test' | 'production',
): string {
  const network =
    environment === 'production'
      ? 'mainnet'
      : environment === 'test'
      ? 'testnet'
      : 'testnet'

  const r = addressFromExtPubKey({
    extPubKey: xpub,
    network,
    keyIndex: index,
  })

  if (!r) {
    throw new Error(
      'Could not derive address.\n\nCheck if the environment is consistent with the Extended Public Key.',
    )
  }

  return r.address as string
}
