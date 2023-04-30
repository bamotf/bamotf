# Welcome to Cashier

Cashier is a near zero-config Bitcoin payment processor that allows you to
accept Bitcoin payments in your app with just a few lines of code without having
to deal with the complexity of setting up a Bitcoin node, managing addresses,
and dealing with the Bitcoin network. It's built on top of the [Bitcoin
Core][bitcoin-core] and it's made for developers first.

## Features

- [x] Accept BIP? payments
- [ ] Automatically manage addresses for you (just provide a Extended Public Key
      and we'll do the rest)

# Installation

To install the Cashier Server,

```bash
brew install @wladiston/cashier
brew services start @wladiston/cashier
```

Or you can start the server using a Docker Compose:

```yaml
version: '3.8'
services:
  bitcoin-core:
    image: btcpayserver/bitcoin:24.0.1
    ports:
      - 18443:18443
      - 18444:18444
    volumes:
      - ./bitcoin-data:/data

  cashier:
    image: wladiston/cashier:latest
    ports:
      - 21000:21000
```

# Usage

After installing the Cashier Server, you can start accepting payments by
accessing the Cashier Dashboard at http://localhost:21000. You will need to
specify how you'd like to connect to the Bitcoin Core. You can either use a
local Bitcoin Core node or connect to a remote node.

// TODO: Criar um endereco (Minerar o bloco) // TODO: Minerar o bloco // TODO:
Enviar o pagamento

## Packages

- [cashier-node](./packages/cashier-node/README.md)
<!-- - [cashier-react](./packages/cashier-react/README.md) -->

What we need:

- [x] Criar um Payment Intent
  - [ ] Adicionar a tarefa numa queue para checar se o payment foi recebido
  - [ ] Job para checar se o pagamento foi recebido
- [ ] Verificar o status de um Payment Intent

Docker Image:

- [ ] Quirrel
- [ ] Redis
- [ ] Bitcoin Core

---

```zsh
# new address
alias bitcoin="bitcoin-cli -regtest -rpcuser=username -rpcpassword=password -rpcwallet=test-wallet"

bitcoin-cli -regtest -rpcuser=username -rpcpassword=password createwallet test-wallet
bitcoin-cli -regtest -rpcuser=username -rpcpassword=password -rpcwallet=test-wallet getnewaddress

# 🚨 So pra ver quanto a carteira tem

bitcoin-cli -regtest -rpcuser=username -rpcpassword=password getdescriptorinfo "addr(bcrt1q6du4q67wfpgnmply8mqce43eedhz286hy3nm6p)"
bitcoin-cli -regtest -rpcuser=username -rpcpassword=password -rpcwallet=clgwoxrm20013p2enbqpxxv0x importdescriptors '[{"desc":"addr(bcrt1q6du4q67wfpgnmply8mqce43eedhz286hy3nm6p)#yeww39pe","timestamp":"now",
"label":"test-address"}]'

# Minerar o bloco para o endereco
bitcoin-cli -regtest -rpcuser=username -rpcpassword=password -rpcwallet=watch-only-wallet generatetoaddress 101 bcrt1qtfjrpdwcxa7et498ead2gwxrnscl8eaaxvdxzp

# 🚨 Generate 101 blocks using a special RPC which is only available in regtest mode. This takes less than a second on a generic PC. Because this is a new block chain using Bitcoin’s default rules, the first blocks pay a block reward of 50 bitcoins. Unlike mainnet, in regtest mode only the first 150 blocks pay a reward of 50 bitcoins. However, a block must have 100 confirmations before that reward can be spent, so we generate 101 blocks to get access to the coinbase transaction from block #1.

# LEVEL_CONFIDENCE: (number or confirmations)

# return only the ballance
bitcoin-cli -regtest -rpcuser=username -rpcpassword=password -rpcwallet=test-wallet getwalletinfo
# return the transactions with the number confirmations
bitcoin-cli -regtest -rpcuser=username -rpcpassword=password -rpcwallet=clgyzlhlv0003p2pi17fvoruf listunspent

clgyzlhlv0003p2pi17fvoruf

# Send to address
bitcoin-cli -regtest -rpcuser=username -rpcpassword=password -rpcwallet=test-wallet sendtoaddress bcrt1q6du4q67wfpgnmply8mqce43eedhz286hy3nm6p 0.1 "drinks" "room77" true true null "unset" null 1.1


# bitcoin-cli getdescriptorinfo "addr(bcrt1qkg5kdqcxlzecaqws4ha80d2twttle869z0ugjv)"
# bitcoin-cli -rpcwallet=descwallet importdescriptors '[{ "desc": "addr(bcrt1qkg5kdqcxlzecaqws4ha80d2twttle869z0ugjv)#ffhyxaga", "timestamp":1455191478, "internal": true }]'

# Lista transacoes (posso usar isso para ver se a transacao foi confirmada e se o valor necessario foi recebido)
# bitcoin-cli -rpcwallet=descwallet listunspent 6 9999999 "[\"bcrt1qkg5kdqcxlzecaqws4ha80d2twttle869z0ugjv\"]"




# Resetar a regtest
rm -rf ~/bitcoin/.bitcoin/regtest

curl --user username:password --data-binary '{"jsonrpc":"1.0","id":"create-wallet-wilson","method":"createwallet","params":{"wallet_name":"wilson","disable_private_keys":true}}' -H 'content-type: text/plain;' http://localhost:18443

curl --user username:password --data-binary '{"jsonrpc":"1.0","id":"import-desc-clgsiiko9000zp2en7m6yn09l","method":"importdescriptors","params":{"desc":"addr(bcrt1q6du4q67wfpgnmply8mqce43eedhz286hy3nm6p)#yeww39pe","timestamp":"now","label":"test-address"}}' -H 'content-type: text/plain;' http://localhost:18443/wallet/clgsigtka000xp2enonkgpyds

```
