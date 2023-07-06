<!-- PROJECT LOGO -->
<p align="center">
  <a href="https://github.com/bam-otf/bam-otf">
   <img src="https://github.com/bam-otf/bam-otf/blob/main/.github/banner.png?raw=true" alt="Logo">
  </a>

  <h3 align="center"><i>bam-otf</i></h3>

  <p align="center">
    The open-source Stripe alternative but for Bitcoin only.
    <br />
    <br />
    <b>⚠️ This is a Work in Progress ⚠️</b> - Do not use it in production!
    <br />
    <br />
    <a href="https://github.com/bam-otf/bam-otf/issues">Issues</a>
  </p>
</p>

<!-- ABOUT THE PROJECT -->

## About the Project

<img width="100%" alt="booking-screen" src="https://user-images.githubusercontent.com/8019099/176390354-f1bc7069-0341-437a-9bb8-eb41092b4016.gif">

# Bitcoin Payments Infrastructure

_Bitcoin Acknowledgement Mechanism Over Time Frame (bam-otf)_ is a near
zero-config solution to accept bitcoins on your application. Designed
specifically for web developers, BAM makes it simple and easy to create payment
intents.

Forget about the need to dive deep into Bitcoin documentation or manage the
communication with the Bitcoin Core. BAM takes care of all of that for you.
There's no need to create and maintain a background service to check if
transactions have been completed - BAM notifies you via a webhook as soon as a
payment is confirmed on the blockchain.

In addition to its core functionality, BAM offers
[Node](./packages/bam-otf-node/README.md) and
[React](./packages/bam-otf-react/README.md) libraries, further easing
implementation for developers.

### Built With

- [Remix.run](https://remix.run/?ref=bam-otf)
- [React.js](https://reactjs.org/?ref=bam-otf)
- [Tailwind CSS](https://tailwindcss.com/?ref=bam-otf)
- [Prisma.io](https://prisma.io/?ref=bam-otf)
- [Turbo](https://turbo.build/?ref=bam-otf)

<!-- GETTING STARTED -->

## Getting Started

To get it and running, please follow these simple steps.

### Prerequisites

Here is what you need to be able to run _bam-otf_.

- docker-compose

### 1. Running the [Server](./apps/bam-otf-server/README.md)

Create a `docker-compose.yml` file in the root of your project and paste the
following:

```yaml
# docker-compose.yml
#
#  This is an example of how you can configure for running
#  bam-otf-server in development mode if you don't already have a
#  Bitcoin Core, Redis, and Postgres instance running.

version: '3.8'
services:
  bam-otf-server:
    image: bam-otf-server:latest
    container_name: bam-otf-server
    restart: always
    environment:
      - REDIS_URL=redis://redis:6379
      - POSTGRES_URL=postgresql://halfinney:randompassword@postgres:5432
      - BITCOIN_CORE_URL=http://username:wc7eFmVwEeZCDYTMaOqxRnLWSR7aI76bGmHl6pRFtAU@bitcoin-core:18443
      - WEBHOOK_URL=<my-webhook-url>
      - WEBHOOK_SECRET=my-fancy-webhook-secret
      - API_KEY=my-fancy-api-key
    ports:
      - 21000:21000
    depends_on:
      - postgres
      - redis
      - bitcoin-core

  # Bitcoin-core for development
  bitcoin-core:
    image: bam-otf-core-dev:latest
    container_name: bitcoin-core
    restart: always

  postgres:
    image: postgres:latest
    restart: always
    environment:
      - POSTGRES_USER=halfinney
      - POSTGRES_PASSWORD=randompassword

  redis:
    image: redis:latest
```

Then run `docker-compose up` and you should be good to go! This will expose the
server on port [21000](http://localhost:21000) with the following credentials:

- Username: `satoshi`
- Password: `satoshi`

### 2. Interact with the server

You can either access the [API](./apps/bam-otf-server/README.md#api) directly or
use the [Node.js client](./packages/bam-otf-node/README.md) to create and manage
Payment Intents.

Here's a full example of how to integrate using
[Next.js](./examples/donation/README.md).

## What's in this repo?

- **[bam-otf/server](apps/bam-otf-server/README.md)** - A server that exposes a
  REST API to create and manage payments.
- **[bam-otf/node](packages/bam-otf-node/README.md)** - A Node.js client to
  interact with the _bam-otf_ server.
- **[bam-otf/react](packages/bam-otf-react/README.md)** - A React component
  library to easily integrate bitcoin payments in your React app.
- **[bam-otf/utils](packages/bam-otf-utils/README.md)** - A utility library to
  help with formatting and stuff like that.

<!-- ACTIVITY -->

## Repo Activity

![Alt](https://repobeats.axiom.co/api/embed/84bb2aa5366b8bbd73d859914d8d655ac65ce02a.svg 'Repobeats analytics image')

<!-- CONTRIBUTING -->

## Contributing

Please see our [contributing guide](/CONTRIBUTING.md).

<!-- LICENSE -->

## License

Distributed under the [AGPLv3 License](./LICENSE). See `LICENSE` for more
information.

<!-- ACKNOWLEDGEMENTS -->

## Acknowledgements

Special thanks to these amazing projects which help power bam-otf:

- [Bitcoin Core](https://github.com/bitcoin/bitcoin)
- [Turbo](https://turbo.build/)
- [Remix.run](https://remix.run)
- [Next.js](https://nextjs.org/)
- [Vercel](https://vercel.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Prisma](https://prisma.io/)
