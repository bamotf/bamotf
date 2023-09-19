import {expect, test} from 'vitest'

import {derive} from './address'

const BIP32 = [
  {
    xpub: 'tpubDAenfwNu5GyCJWv8oqRAckdKMSUoZjgVF5p8WvQwHQeXjDhAHmGrPa4a4y2Fn7HF2nfCLefJanHV3ny1UY25MRVogizB2zRUdAo7Tr9XAjm',
    index: 0,
    environment: 'development',
    expected: 'tb1qvthmarwr4hwalqnzvzmturavxjymvphqvdr0qt',
  },
  {
    xpub: 'tpubDAenfwNu5GyCJWv8oqRAckdKMSUoZjgVF5p8WvQwHQeXjDhAHmGrPa4a4y2Fn7HF2nfCLefJanHV3ny1UY25MRVogizB2zRUdAo7Tr9XAjm',
    index: 0,
    environment: 'test',
    expected: 'tb1qvthmarwr4hwalqnzvzmturavxjymvphqvdr0qt',
  },
  {
    xpub: 'xpub6AHA9hZDN11k2ijHMeS5QqHx2KP9aMBRhTDqANMnwVtdyw2TDYRmF8PjpvwUFcL1Et8Hj59S3gTSMcUQ5gAqTz3Wd8EsMTmF3DChhqPQBnU',
    index: 0,
    environment: 'production',
    expected: 'bc1qvthmarwr4hwalqnzvzmturavxjymvphqxtcumc',
  },
]

const BIP44 = [
  {
    xpub: 'xpub6GJHbUa6nTgsYgBbj3oVTDKaUE1AMLfuy92HV68fqCirtf7WCFKwi4FDGdxBE21RXHUembnDoi7Mf15obHvobZBq6i8m2KLKiD8SUwh6T8R',
    index: 0,
    environment: 'production',
    expected: 'bc1q42d74a7fcyt5rasj82lxdeqd6lus9w7ngf4q6s',
  },
]

const BIP49 = [
  {
    xpub: 'ypub6b7KMc6WLZHrTUoM8nraYSZRJ37rTjbSR2zH2jmav8Gc27eEkYKLF4gxTFkyUynTUBFvJC7TThJgqLRff81xwUSoxGX6vp7vnnwCv2B5SPg',
    index: 0,
    environment: 'production',
    expected: 'bc1qhawyzmncmpf5ade5s2tduj2wgl48ud0vvc968w',
  },
]

const BIP84 = [
  {
    xpub: 'zpub6ujDshrQgEazY4SAESpDFsKHt2UFaLjjBjziMcaR6CWJYB2kMpXWTFGvVFfrSxoGYb4xCTZVLDX2BF4ZoRLuzTtTkVVedCFTKTCqMbBJq9y',
    index: 0,
    environment: 'production',
    expected: 'bc1qr7kk6cdv3hvw4lpadutzw900a083mgf0mufpdx',
  },
]

test.each([...BIP32, ...BIP44, ...BIP49, ...BIP84])(
  'should derive a extended public key on ($xpub, $index, $environment) -> $expected',
  ({xpub, index, environment, expected}) => {
    expect(
      derive(xpub, index, environment as 'development' | 'test' | 'production'),
    ).toBe(expected)
  },
)
