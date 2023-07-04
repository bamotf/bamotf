import * as bitcoin from 'bitcoinjs-lib'
import HDKey from 'hdkey'

export function derive(xpub: string, index: number): string {
  // FIX: Use bitcoin.networks.testnet for testnet
  const network = bitcoin.networks.regtest
  const hdNode = HDKey.fromExtendedKey(xpub)
  const childNode = hdNode.derive(`m/${index}`)

  return bitcoin.payments.p2pkh({pubkey: childNode.publicKey, network})
    .address as string
}
