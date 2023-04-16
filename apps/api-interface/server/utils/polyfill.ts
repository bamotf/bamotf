/**
 * Polyfill BigInt to string form in JSON.stringify
 */

// eslint-disable-next-line @typescript-eslint/no-redeclare
interface BigInt {
  /** Convert to BigInt to string form in JSON.stringify */
  toJSON: () => number
}

BigInt.prototype.toJSON = function () {
  return Number(this)
}
