import {expect, test} from 'vitest'

import {derive} from './address'

test.each([
  {
    xpub: 'tpubD6NzVbkrYhZ4WqDXB2micwhW8FN4LPM1tz3Jp2Bx8SnVsbcRQPSbePpV5MUwLxtVgaC6NE8h9ouV5pfw4d4YG4Waw44YggcBsP7fftmpQK8',
    index: 0,
    environment: 'development',
    expected: 'mmMXig7KfytM6DHXHMsZxW5aGDigXENJ2c',
  },
  {
    xpub: 'tpubD6NzVbkrYhZ4WqDXB2micwhW8FN4LPM1tz3Jp2Bx8SnVsbcRQPSbePpV5MUwLxtVgaC6NE8h9ouV5pfw4d4YG4Waw44YggcBsP7fftmpQK8',
    index: 0,
    environment: 'test',
    expected: 'mmMXig7KfytM6DHXHMsZxW5aGDigXENJ2c',
  },
  {
    xpub: 'xpub6AHA9hZDN11k2ijHMeS5QqHx2KP9aMBRhTDqANMnwVtdyw2TDYRmF8PjpvwUFcL1Et8Hj59S3gTSMcUQ5gAqTz3Wd8EsMTmF3DChhqPQBnU',
    index: 0,
    environment: 'production',
    expected: '13YFhXczTu9MQEg8gi3fDBoSFJiD91ZyJg',
  },
])(
  'should derive a extended public key on ($xpub, $index, $environment) -> $expected',
  ({xpub, index, environment, expected}) => {
    expect(
      derive(xpub, index, environment as 'development' | 'test' | 'production'),
    ).toBe(expected)
  },
)
