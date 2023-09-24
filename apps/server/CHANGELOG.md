# @bamotf/server

## 0.0.3

### Patch Changes

- 85af7f2: Add extra colors and move components to named colors
- d8927cf: Fix an error when the initial amount datatypes don't correspont to
  the typescript types
- d214075: chore: update vistest and close some security issues
- 49d7348: Add environment selector to allow devs to share the same server for
  development, test and production data. `Development` environmnet will not be
  connected to any bitcoin core so devs can simulate payments without having to
  dealing with the bitcoin core while leaving the `test` enviroment for the
  Bitcoin testnet and `production` for the mainnet. This also introduces a new
  api endpoint at `/api/payment-intents/:idOrAddress/simulate-payment` that
  allows bypassing the payment checks during development. The simulate payment
  UI is directly on the payment now.
  - @bamotf/utils@0.0.3

## 0.0.2

### Patch Changes

- db6e21e: Fix a bug where user would get an Invalid password error on the
  current password field when changing both password and username at same time
  - @bamotf/utils@0.0.2

## 0.0.1

### Patch Changes

- 0615815: Create the `bamotf` server to handle payment intents
- Updated dependencies [0615815]
  - @bamotf/utils@0.0.1
