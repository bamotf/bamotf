#!/bin/bash
set -e

# Variables
WALLET_NAME="test-wallet"
echo "🧪 Starting Bitcoin Core in regtest mode"

# Start Bitcoin Core
exec bitcoind -printtoconsole \
  -regtest=1 \
  -debug=http \
  -rpcbind=0.0.0.0 \
  -rpcallowip=0.0.0.0/0 \
  -rpcauth='username:340db8e27fe6914442fd3564f5a1dfb0$89b8428fdff2b34f6f1adb2e19ac7e7a610891ea00261afaf3c647b0d550eea5' \
  -datadir=$BITCOIN_DATA &

sleep 3

# Create a wallet if it doesn't exist
if [ ! -f "$BITCOIN_DATA/regtest/wallets/$WALLET_NAME/wallet.dat" ]; then
    echo "🧪 Creating the test wallet: $WALLET_NAME"
    bitcoin-cli -datadir=$BITCOIN_DATA -regtest -named createwallet wallet_name="$WALLET_NAME" load_on_startup=true

    # Get the address from the wallet
    ADDRESS=$(bitcoin-cli -datadir=$BITCOIN_DATA -regtest -rpcwallet="$WALLET_NAME" getnewaddress)

    # Generate 101 blocks to the given address
    bitcoin-cli -datadir=$BITCOIN_DATA -regtest generatetoaddress 101 "$ADDRESS"
fi

sleep infinity