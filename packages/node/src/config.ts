export type BamotfConfig = {
  /**
   * Hostname of the *bamotf* server.
   * @default 'http://localhost:21000'
   */
  baseURL?: string

  /**
   * Maximum number of retries for network errors.
   * @default 3
   */
  // TODO: handle failed attempts
  // maxNetworkRetries?: number
  /**
   * Timeout for network requests.
   * @default 60000
   */
  timeout?: number
}
