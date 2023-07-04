import {expect, test} from 'vitest'

import {format, toFraction} from './currency-format'

test('toFraction', () => {
  expect(toFraction({amount: BigInt(100), currency: 'USD'})).toBe(1)
  expect(toFraction({amount: BigInt(100), currency: 'BRL'})).toBe(1)
  expect(toFraction({amount: BigInt(100), currency: 'JPY'})).toBe(100)
  expect(toFraction({amount: BigInt(100), currency: 'BDT'})).toBe(0.1)
  expect(toFraction({amount: BigInt(100), currency: 'KWD'})).toBe(0.1)
})

test('format', () => {
  expect(format({amount: BigInt(100), currency: 'USD'})).toBe('$1.00')
  expect(format({amount: BigInt(100), currency: 'BRL'})).toBe('R$1.00')
  expect(format({amount: BigInt(100), currency: 'JPY'})).toBe('¥100')
  expect(
    format('pt-BR', {amount: BigInt(420_000_99), currency: 'BRL'}),
  ).toContain('420.000,99')
})
