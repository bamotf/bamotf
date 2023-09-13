import ecc from '@bitcoinerlab/secp256k1'
import BIP32Factory from 'bip32'
import * as bitcoin from 'bitcoinjs-lib'

const bip32 = BIP32Factory(ecc)

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
      ? bitcoin.networks.bitcoin
      : environment === 'test'
      ? bitcoin.networks.testnet
      : bitcoin.networks.regtest

  const hdNode = bip32.fromBase58(xpub, network)
  const child = hdNode.derive(index)

  const {address} = bitcoin.payments.p2pkh({
    pubkey: child.publicKey,
    network,
  })

  if (!address) {
    throw new Error('Could not derive address')
  }

  return address
}
