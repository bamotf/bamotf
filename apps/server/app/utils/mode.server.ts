import {redirect} from '@remix-run/node'

import {env} from '~/utils/env.server'

/**
 * Environment Mode in which the app is running
 */
export type Mode = keyof ReturnType<typeof getEnabledModes>

/**
 * Get enabled mode from environment variables
 */
export function getEnabledModes() {
  return {
    dev: env.DEV_MODE_ENABLED,
    test: !!env.TESTNET_BITCOIN_CORE_URL,
    production: !!env.MAINNET_BITCOIN_CORE_URL,
  }
}
/**
 * Check if mode is enabled and return it
 *
 * @param userMode the mode user wants to use
 * @returns
 */
export function requireEnabledMode(userMode: string = '') {
  const enabledModes = getEnabledModes()
  let mode: Mode

  switch (userMode) {
    case 'dev':
      mode = 'dev'
      break
    case 'test':
      mode = 'test'
      break
    case '':
      mode = 'production'
      break
    default:
      throw new Response(`Invalid mode: ${userMode}`, {
        status: 400,
        statusText: 'Invalid mode',
      })
  }

  // if mode is not enabled, redirect to the first enabled mode
  if (!enabledModes[mode]) {
    const priority: Mode[] = ['dev', 'production', 'test']
    // find the first enabled mode
    mode = priority.filter(m => enabledModes[m])[0]

    throw redirect(mode === 'production' ? '/' : `/${mode}`, {
      statusText: `Mode ${mode} is not enabled`,
    })
  }

  return mode
}
