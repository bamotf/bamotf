# @bamotf/node

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
