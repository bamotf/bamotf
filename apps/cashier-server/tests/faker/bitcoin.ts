import * as bitcoin from 'bitcoinjs-lib'
import ECPairFactory from 'ecpair'
import * as ecc from 'tiny-secp256k1'

const ECPair = ECPairFactory(ecc)

const network = bitcoin.networks.regtest

/**
 * Creates a random bitcoin address
 */
export function createRandomAddress() {
  const functions = [
    createRandomP2PKHAddress,
    createRandomP2SHAddress,
    createRandomBech32Address,
  ]
  const randomIndex: number = Math.floor(Math.random() * functions.length)
  return functions[randomIndex]()
}

/**
 * P2PKH (BASE58) / Legacy
 */
export function createRandomP2PKHAddress() {
  const keyPair = ECPair.makeRandom({
    network,
  })

  const {address} = bitcoin.payments.p2pkh({
    pubkey: keyPair.publicKey,
    network,
  })

  if (!address) {
    throw new Error('Could not create address')
  }

  return address
}

/**
 * P2SH (BASE58) / Segwit - Pay to Script Hash
 */
export function createRandomP2SHAddress() {
  const keyPair = ECPair.makeRandom({
    network,
  })

  const {address} = bitcoin.payments.p2sh({
    redeem: bitcoin.payments.p2wpkh({
      pubkey: keyPair.publicKey,
      network,
    }),
    network,
  })

  if (!address) {
    throw new Error('Could not create address')
  }

  return address
}

/**
 * P2WPKH (BECH32) / Native SegWit
 */
export function createRandomBech32Address() {
  const keyPair = ECPair.makeRandom({
    network,
  })

  const {address} = bitcoin.payments.p2wpkh({
    pubkey: keyPair.publicKey,
    redeem: bitcoin.payments.p2sh({
      redeem: bitcoin.payments.p2wpkh({
        pubkey: keyPair.publicKey,
        network,
      }),
      network,
    }),
    network,
  })

  if (!address) {
    throw new Error('Could not create address')
  }

  return address
}

/**
 * Checks if a given bitcoin address is valid
 * @param address
 * @returns
 */
export function isAddressValid(address: string) {
  try {
    bitcoin.address.toOutputScript(address, network)
    return true
  } catch (e) {
    return false
  }
}
