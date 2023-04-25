# Cashier - NodeJS

## Requirements

- [ ] Node.js 16 or higher

## Installation

Install the package with:

```bash
npm install @wladiston/cashier --save
# or
yarn add @wladiston/cashier
# or
pnpm i @wladiston/cashier --save
```

## Usage

The package needs to be configured with your account's secret key, which is
available after the registration on the [Cashier Dashboard][dashboard].

```ts
import Cashier from '@wladiston/cashier'

const client = new Cashier('my-fancy-token', {
  //   host: 'localhost',
  //   port: 21000,
})

const pi = await client.paymentIntents.create({
  amount: 420_000_000,
  address: 'bc1q00hf9mlaxzej30cx5q6200c636ufdc4gjmqyuh',
})
```
