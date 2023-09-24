export type BamotfConfig = {
  /**
   * Hostname of the *bamotf* server.
   * @default 'http://localhost:21000' or loaded from `BAMOTF_SERVER_URL` environment variable.
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
