import {expect, test} from 'vitest'

import {
  convertFromSats,
  convertToSats,
  format,
  toFraction,
} from './currency-format'

test('toFraction', () => {
  expect(toFraction({amount: 199n, currency: 'USD'})).toBe(1.99)
  expect(toFraction({amount: 100n, currency: 'BRL'})).toBe(1)
  expect(toFraction({amount: 100n, currency: 'JPY'})).toBe(100)
  expect(toFraction({amount: 100n, currency: 'BDT'})).toBe(0.1)
  expect(toFraction({amount: 100n, currency: 'KWD'})).toBe(0.1)
})

test('format', () => {
  expect(format({amount: 100n, currency: 'USD'})).toBe('$1.00')
  expect(format({amount: 100n, currency: 'BRL'})).toBe('R$1.00')
  expect(format({amount: 100n, currency: 'JPY'})).toBe('¥100')
  expect(format('pt-BR', {amount: 420_000_99n, currency: 'BRL'})).toContain(
    '420.000,99',
  )
})

test('convertToSats', () => {
  expect(
    convertToSats({amount: 10000n, currency: 'USD', price: 30789.59}),
  ).toBe(324785n)
  expect(
    convertToSats({
      amount: 10000n,
      currency: 'BRL',
      price: 149101.849999999,
    }),
  ).toBe(67068n)
  expect(convertToSats({amount: 1000n, currency: 'JPY', price: 1000})).toBe(
    1_00_000_000n,
  )
})

test('convertFromSats', () => {
  expect(
    convertFromSats({amount: 1_00_000_000n, currency: 'JPY', price: 1000}),
  ).toBe(1000n)
  expect(
    convertFromSats({amount: 324785n, currency: 'USD', price: 30789.59}),
  ).toBe(10000n)
  expect(
    convertFromSats({
      amount: 67068n,
      currency: 'BRL',
      price: 149101.849999999,
    }),
  ).toBe(10000n)
})
