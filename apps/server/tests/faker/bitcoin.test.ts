import {expect, test} from 'vitest'

import {
  createRandomBech32Address,
  createRandomP2PKHAddress,
  createRandomP2SHAddress,
  isAddressValid,
} from './bitcoin'

test("bitcoin P2PKH addresses start with a '1'", () => {
  const address = createRandomP2PKHAddress()
  expect(address).to.match(/^[mn]/)
})

test("bitcoin P2SH addresses start with a '3'", () => {
  const address = createRandomP2SHAddress()
  expect(address).to.match(/^2/)
})

test("bitcoin Bech32 addresses start with a '3'", () => {
  const address = createRandomBech32Address()
  expect(address).to.match(/^bcrt1/)
})

test('a address is valid', () => {
  let address = createRandomP2PKHAddress()
  expect(isAddressValid(address)).toBeTruthy()

  address = createRandomP2SHAddress()
  expect(isAddressValid(address)).toBeTruthy()

  address = createRandomBech32Address()
  expect(isAddressValid(address)).toBeTruthy()
})
