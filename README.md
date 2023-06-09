# ⚠️ This is a Work in Progress ⚠️

# Welcome to Cashier

Cashier is a near zero-config Bitcoin payment processor that allows you to
accept Bitcoin payments in your app with just a few lines of code without having
to deal with the complexity of setting up a Bitcoin node, managing addresses,
and dealing with the Bitcoin network. It's built on top of the [Bitcoin
Core][bitcoin-core] and it's made for developers first.

## Packages

- **cashier-server** - A server that exposes a REST API to create and manage
  invoices.
- **[cashier-node](./packages/cashier-node/README.md)** - A Node.js client to
interact with the Cashier server.
<!-- - **[cashier-react](./packages/cashier-react/README.md)** - A React component to
  easily integrate bitcoin payments in your React app. -->

TODO:

- [ ] Dev needs install package from npm
  <!--
    - [ ] openapi contract
    - [ ] openapi remix build
    - [ ] openapi typescript generate files -->

  - [ ] create types manually for v0.0.1
  - [ ] changeset auto publish
  - [ ] changeset bot
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
