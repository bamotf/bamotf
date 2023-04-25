/**
 * Polyfill BigInt to string form in JSON.stringify as a number
 */

interface BigInt {
  /** Convert to BigInt to string form in JSON.stringify */
  toJSON: () => number
}

// @ts-expect-error - 😢 I had to...
BigInt.prototype.toJSON = function () {
  if (
    (this as bigint) >= BigInt(Number.MIN_SAFE_INTEGER) &&
    (this as bigint) <= BigInt(Number.MAX_SAFE_INTEGER)
  ) {
    return Number(this)
  }

  throw new TypeError('Do not know how to serialize a BigInt')
}

export {}
