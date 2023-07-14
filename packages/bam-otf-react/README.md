# @bamotf/react

This package contains React components that help you build bitcoin related
interfaces.

## Installation

```bash
npm install @bamotf/react
# or
yarn add @bamotf/react
# or
pnpm add @bamotf/react
```

## Usage

```tsx
import {Payment} from '@bamotf/react'

import '@bamotf/react/styles.css'

export function App() {
  const pi = ... // get payment intent from server
  const price = ... // get current price from server

  return (
    <Payment intent={pi} price={price} />
  )
}

```

### `<Payment intent={} price={} />`

This component should show the

- QRCode
- Address
- Amount in BTC

### `<QRCode />`

This component needs to receive:

- bitcoin address
- amount - it should accept the amount in sats (bigint)
- label - _optional_
- message - _optional_

and spits out a SVG that translates to the following URL format:

```jsx
bitcoin:BC1QYLH3U67J673H6Y6ALV70M0PL2YZ53TZHVXGG7U
  ?amount=0.00001
  &label=sbddesign%3A%20For%20lunch%20Tuesday
  &message=For%20lunch%20Tuesday
```

### `<ValueFormatted amount={} currency={} />`

Wrapper around `currency.format`.
