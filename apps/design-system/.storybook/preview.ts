import type {Preview} from '@storybook/react'

import '@bam-otf/react/styles.css'

// HACK: storybook 'do not know how to serialize a BigInt'
// @ts-expect-error - Add a 'hack' to resolve 'do not know how to serialize a BigInt'
BigInt.prototype.toJSON = function () {
  if (
    (this as bigint) >= BigInt(Number.MIN_SAFE_INTEGER) &&
    (this as bigint) <= BigInt(Number.MAX_SAFE_INTEGER)
  ) {
    return Number(this)
  }

  throw new TypeError('Do not know how to serialize a BigInt')
}

const preview: Preview = {
  parameters: {
    backgrounds: {
      values: [
        {name: 'white', value: '#fff'},
        {name: 'black', value: '#000'},
        {name: 'grey', value: '#ccc'},
      ],
    },
    actions: {argTypesRegex: '^on[A-Z].*'},
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
}

export default preview
