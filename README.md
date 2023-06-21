**⚠️ This is a Work in Progress ⚠️** - Do not use this with your bitcoin core.
I'm creating this in public. This is not ready for production!

# _bam-otf_

_Bitcoin Acknowledgement Mechanism Over Time Frame (bam-otf)_ is a near
zero-config solution to accept bitcoins on your application with just a few
lines of code without having to deal with communication with the network.
Heavily inspired by [Stripe][stripe]. It's built on top of the [Bitcoin
Core][bitcoin] and it's made for developers first.

## Why?

Bitcoin is the internet money. Period. But it's not easy to use and even harder
to integrate with your application.

Developers have to read a lot of very poor documentation spread on the internet
which not always match the precise version of the Bitcoin Core they are using.
They also need to learn a bunch of complicated terms like utxo, bip69420,
extended public key, etc.

Expect that all 26.9 million software developers in the world are going to
dedicate a lot of time to implement a bitcoin payment system in their
application is not realistic.

_bam-otf_ is here to change that. The goal is: Bitcoin integrations should be
easier than Stripe.

## How it works

The _bam-otf_ server exposes a REST API that allows you to create and manage
payments. The server will create a new address for each payment and will monitor
the blockchain for incoming transactions. Once a transaction is detected, the
server will notify the client that the payment was received and confirmed.

## Apps

- **[bam-otf/server](apps/bam-otf-server/README.md)** - A server that exposes a
  REST API to create and manage payments.

## Packages

- **[@bam-otf/node](packages/bam-otf-node/README.md)** - A Node.js client to
  interact with the _bam-otf_ server.
- **[bam-otf/react](packages/bam-otf-react/README.md)** - A React component
  library to easily integrate bitcoin payments in your React app.
- **[bam-otf/utils](packages/bam-otf-utils/README.md)** - A utility library to
  help with formatting and stuff like that.

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) for more information on how to get
started.

[stripe]: https://stripe.com
[bitcoin]: https://bitcoin.org/en/
