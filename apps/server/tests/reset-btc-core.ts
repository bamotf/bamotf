import {
  listWallets,
  unloadWallet,
  type SupportedNetworks,
} from '~/utils/bitcoin-core'

async function cleanWallets(network: SupportedNetworks) {
  const wallets = await listWallets(network)

  const fakeWallets = wallets.filter(
    (wallet: string) => wallet !== 'test-wallet',
  )

  return await Promise.all(
    fakeWallets.map(wallet => unloadWallet({wallet, network})),
  )
}

export default async function resetBitcoinCore() {
  return await Promise.all([
    // cleanWallets('prod'),
    cleanWallets('test'),
  ])
}
