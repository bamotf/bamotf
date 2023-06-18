# ⚠️ This is a Work in Progress ⚠️

# _bam-otf_ - Bitcoin Acknowledgement Mechanism - On The Fly

_bam-otf_ is a near zero-config way to accept bitcoins on your application with
just a few lines of code without having to deal with communication with the
network. Heavily inspired by [Stripe][stripe]. It's built on top of the [Bitcoin
Core][bitcoin] and it's made for developers first.

## Packages

- **bam-otf/server** - A server that exposes a REST API to create and manage
  payments.
- **[bam-otf/node](./packages/bam-otf-node/README.md)** - A Node.js client to
interact with the _bam-otf_ server.
<!-- - **[bam-otf/react](./packages/bam-otf-react/README.md)** - A React component to
  easily integrate bitcoin payments in your React app. -->

## Contributing

Read [CONTRIBUTING.md](./CONTRIBUTING.md) for more information on how to get
started.

## TODO:

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
  - [ ] create docs

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
