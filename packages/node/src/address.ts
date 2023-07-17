import * as bitcoin from 'bitcoinjs-lib'
import HDKey from 'hdkey'

/**
 * Derive a bitcoin address from an Extendend Public Key (XPUB) at a given index and
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
  environment: 'development' | 'preview' | 'production' = 'development',
): string {
  const network =
    environment === 'production'
      ? bitcoin.networks.bitcoin
      : environment === 'preview'
      ? bitcoin.networks.testnet
      : bitcoin.networks.regtest

  const hdNode = HDKey.fromExtendedKey(xpub)
  const childNode = hdNode.derive(`m/${index}`)

  return bitcoin.payments.p2pkh({
    pubkey: childNode.publicKey,
    network,
  }).address as string
}
