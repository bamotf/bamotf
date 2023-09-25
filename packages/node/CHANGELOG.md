# @bamotf/node

## 0.1.1

### Patch Changes

- 5f12736: - Added `currency.toBitcoin` to get the bitcoin value of a currency
  amount

  - Added `currency.getBitcoinPrice` to get the price of 1 BTC in the given
    currency

- Updated dependencies [4a8ff4b]
  - @bamotf/utils@0.1.1

## 0.1.0

### Patch Changes

- 94ac7fd: Fix error while derivating old addresses (#73)

## 0.0.2

### Patch Changes

- db6e21e: Fix an issue with `derive` address when the environment was set to
  preview and the address was an xpub
- db6e21e: Replaces the `tiny-secp256k1` dependency with the
  `@bitcoinerlab/secp256k1` to be able to support more node environments
- db6e21e: Pin the default baseURL to the port 21000
- db6e21e: Fix an error when during the type conversion when the server returns
  no data

## 0.0.1

### Patch Changes

- 0615815: Create the `@bamotf/node` package that can be installed by devs and
  let devs interact with the server
