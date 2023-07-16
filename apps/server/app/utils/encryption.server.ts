import bcrypt from 'bcryptjs'

const SALT_ROUNDS = 10

/**
 * Encrypts a string using bcrypt.
 * @param text text to encrypt
 * @returns
 */
export async function encrypt(text: string) {
  return bcrypt.hash(text, SALT_ROUNDS)
}

/**
 * Checks if the encrypted text matches the hash
 * @param text encrypted text
 * @param hash
 * @returns {true} if the text is valid
 */
export async function decrypt(text: string, hash: string) {
  return bcrypt.compare(text, hash)
}

/**
 * Utility to create a new secret
 * @param length Length of the secret
 * @returns
 */
export function createSecret(length = 40): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let secret = ''
  for (let i = 0; i < length; i++) {
    secret += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return secret
}
