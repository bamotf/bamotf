import {listWallets, unloadWallet} from '~/utils/bitcoin-core'

export default async function resetBitcoinCore() {
  const wallets = await listWallets()

  const fakeWallets = wallets.filter(wallet => wallet !== 'test-wallet')

  return await Promise.all(fakeWallets.map(unloadWallet))
}
