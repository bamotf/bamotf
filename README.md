# ⚠️ This is a Work in Progress ⚠️

Do not use this with your bitcoin core. This is not ready for production.

# _bam-otf_ - Bitcoin Payment Gatewat

Bitcoin Acknowledgement Mechanism Over Time Frame (bam-otf) is a near
zero-config way to accept bitcoins on your application within just a few lines
of code without having to deal with communication with the network. Heavily
inspired by [Stripe][stripe]. Built on top of the [Bitcoin Core][bitcoin] and
made for developers first.

## Apps

- **bam-otf/server** - A server that exposes a REST API to create and manage
  payments.

## Packages

- **[@bam-otf/node](./packages/bam-otf-node/README.md)** - A Node.js client to
interact with the _bam-otf_ server.
<!-- - **[bam-otf/react](./packages/bam-otf-react/README.md)** - A React component to
  easily integrate bitcoin payments in your React app. -->

## Development

```bash
docker-compose up -d
pnpm install
pnpm dev
```

### TODO:

- [ ] Dev needs install package from npm
  <!--
    - [ ] openapi contract
    - [ ] openapi remix build
    - [ ] openapi typescript generate files -->

  - [x] create types manually for v0.0.1
  - [x] parse data from api
  - [x] changeset auto publish
  - [x] changeset bot
  - [ ] derive address
  - [x] create docs

- [ ] Dev needs to start the service

  - [ ] Dev start via docker
    - [ ] build docker-compose for development server
    - [ ] build docker image for production server
    - [ ] push docker image to registry
    - [ ] create docs

- [ ] Dev need a react components to get started

  - [ ] create react components
  - [ ] create docs

- [ ] Publish
  - [ ] demo app
  - [ ] video showing how to use
  - [ ] youtube
  - [ ] twitter
  - [ ] discord
  - [ ] reddit post
  - [ ] blog post
  - [ ] linkedin post

[stripe]: https://stripe.com
[bitcoin]: https://bitcoin.org/en/
