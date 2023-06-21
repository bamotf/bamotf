# [_bam-otf_][bam-otf] NodeJS Library

This library provides convenient access to the bam-otf API from applications
written in server-side JavaScript.

## Documentation

See [video demonstrations][youtube-playlist] covering how to use the library.

## Requirements

Node 12 or higher.

## Installation

Install the package with:

```sh
npm install @bam-otf/node --save
# or
yarn add @bam-otf/node
# or
pnpm i @bam-otf/node --save
```

## Usage

The package needs to be configured with your account's secret key, which is
available in the [bam-otf Dashboard][api-keys]. Require it with the key's value:

<!-- prettier-ignore -->
```js
const bamotf = require('@bam-otf/node')('secret-key...');

bamotf.paymentIntents.retrieve({
  amount: 50,
  currency: 'USD',
  address: 'bc1q00hf9mlaxzej30cx5q6200c636ufdc4gjmqyuh',
})
  .then(customer => console.log(customer.id))
  .catch(error => console.error(error));
```

Or using ES modules and `async`/`await`:

```js
import BamOtf from '@bam-otf/node'

const bamotf = new BamOtf('my-fancy-token', {
  //   host: 'localhost',
  //   port: 21000,
})

const pi = await bamotf.paymentIntents.create({
  amount: 6.25,
  address: 'bc1q00hf9mlaxzej30cx5q6200c636ufdc4gjmqyuh',
})

console.log(pi.id)
```

### Usage with Deno

TODO: add instructions for Deno

<!-- `@bam-otf/node` provides a `deno` export target. In your Deno
project, import `@bam-otf/node` using an npm specifier:

Import using npm specifiers:

```js
import BamOtf from 'npm:@bam-otf/node'
```

Please see [examples/bamotf-node-deno-sample][] for more
detailed example and instructions on how to use bamotf/node in Deno. -->

## Configuration

### Initialize with config object

The package can be initialized with several options:

```js
const bamotf = BamOtf('sk_test_...', {
  host: 'api.example.com',
  port: 123,
})
```

| Option | Default       | Description                     |
| ------ | ------------- | ------------------------------- |
| `host` | `'localhost'` | Host that requests are made to. |
| `port` | 21000         | Port that requests are made to. |

> **Note** Both `maxNetworkRetries` and `timeout` can be overridden on a
> per-request basis.

### Webhook signing

_bam-otf_ can optionally sign the webhook events it sends to your endpoint,
allowing you to validate that they were not sent by a third-party.

Please note that you must pass the _raw_ request body, exactly as received from
_bam-otf_, to the `constructEvent()` function; this will not work with a parsed
(i.e., JSON) request body.

You can find an example of how to use this with various JavaScript frameworks in
[`examples/webhook-signing`][examples/webhook-signing] folder, but here's what
it looks like:

```js
const {success, parsed} = bamotf.webhooks.constructEvent(
  webhookRawBody,
  webhookSignatureHeader,
  webhookSecret,
)
```

#### Testing Webhook signing

You can use `bamotf.webhooks.generateTestHeaderString` to mock webhook events
that come from _bam-otf_:

```js
const payload = {
  id: 'evt_test_webhook',
  object: 'event',
}

const payloadString = JSON.stringify(payload, null, 2)
const secret = 'test_secret'

const header = bamotf.webhooks.generateTestHeaderString({
  payload: payloadString,
  secret,
})

const event = bamotf.webhooks.constructEvent(payloadString, header, secret)

if (!event.success) {
  throw new Error('Not Authorized')
}

// Do something with mocked signed event
expect(event.parsed.id).to.equal(payload.id)
```

## Contributing

Follow the instructions in [CONTRIBUTING.md][contributing] to set up your
environment.

[bam-otf]: ../../README.md
[contributing]: ../../CONTRIBUTING.md

<!-- [youtube-playlist]: https://www.youtube.com/playlist?list= -->
<!-- [examples/webhook-signing]: ../../examples/webhook-signing -->