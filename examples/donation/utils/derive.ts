import * as bitcoin from 'bitcoinjs-lib'
import HDKey from 'hdkey'

export function deriveAddress(xpub: string, index: number): string {
  const network = bitcoin.networks.regtest // Use bitcoin.networks.testnet for testnet
  const hdNode = HDKey.fromExtendedKey(xpub)
  const childNode = hdNode.derive(`m/${index}`)

  return bitcoin.payments.p2pkh({pubkey: childNode.publicKey, network})
    .address as string
}
