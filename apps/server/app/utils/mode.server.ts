import {redirect} from '@remix-run/node'

import {env} from '~/utils/env.server'
import {commitSession, getSession} from './session.server'

/**
 * Environment Mode in which the app is running
 */
export type Mode = keyof typeof enabledModes

/**
 * Get enabled mode from environment variables
 */
export const enabledModes = {
  dev: env.DEV_MODE_ENABLED,
  test: !!env.TESTNET_BITCOIN_CORE_URL,
  production: !!env.MAINNET_BITCOIN_CORE_URL,
}

/**
 * Check if mode is enabled and return it
 *
 * @param userMode the mode user wants to use
 * @returns
 */
export async function requireEnabledMode(request: Request) {
  let mode: Mode

  let userMode = await getModeFromSession(request)

  // if the user has not set a mode yet, get the first enabled mode
  if (!userMode) {
    // The order of priority is dev, production, test
    // so if dev is enabled, it will be the default mode
    // while production will have priority over test
    const priorityModes = ['dev', 'production', 'test'] as const
    // get the first mode that is enabled
    userMode = priorityModes.find(mode => enabledModes[mode])
  }

  switch (userMode) {
    case 'dev':
      mode = 'dev'
      break
    case 'test':
      mode = 'test'
      break
    default:
      mode = 'production'
      break
  }

  return mode
}

/**
 * Get mode in which the data is  stored in session
 *
 * @param request
 * @returns
 */
async function getModeFromSession(request: Request) {
  const session = await getSession(request.headers.get('Cookie'))
  return session.get('mode') as Mode | undefined
}

/**
 * Commit session with mode
 * NOTE: this should be used on `Set-Cookie` header
 *
 * @param request
 * @param mode
 * @returns
 */
export async function setModeSession(request: Request, mode: Mode) {
  const session = await getSession(request.headers.get('Cookie'))
  session.set('mode', mode)
  return commitSession(session)
}
