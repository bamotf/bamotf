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
  prod: !!env.MAINNET_BITCOIN_CORE_URL,
}

/**
 * Check if mode is enabled and return it
 *
 * @param userMode the mode user wants to use
 * @returns
 */
export async function requireEnabledMode(request: Request) {
  let mode = await getModeFromSession(request)

  // if the user has not set a mode yet, get the first enabled mode
  if (!mode) {
    // The order of priority is so if dev is enabled,
    // it will be the default mode while prod will have
    // priority over test
    const priorityModes = ['dev', 'prod', 'test'] as const
    // get the first mode that is enabled
    mode = priorityModes.find(m => enabledModes[m]) as Mode
  }

  if (!enabledModes[mode]) {
    throw new Response(`Mode disabled: ${mode}`, {
      status: 400,
      statusText: 'Mode disabled',
    })
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
