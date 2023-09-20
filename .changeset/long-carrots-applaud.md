---
'@bamotf/server': patch
---

Add environment selector to allow devs to share the same server for development,
test and production data. `Development` environmnet will not be connected to any
bitcoin core so devs can simulate payments without having to dealing with the
bitcoin core while leaving the `test` enviroment for the Bitcoin testnet and
`production` for the mainnet. This also introduces a new api endpoint at
`/api/payment-intents/:idOrAddress/simulate-payment` that allows bypassing the
payment checks during development. The simulate payment UI is directly on the
payment now.
