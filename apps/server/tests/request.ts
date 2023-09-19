import {env} from '~/utils/env.server'
import {type Mode} from '~/utils/prisma.server'
import * as db from './faker/db'

// TODO: this file is just a placeholder for now, see
// https://discord.com/channels/770287896669978684/940264701785423992/1126622590614655127

// The idea is to have a function that can be used to test the routes
// It should be able to import the loader from the route file get the params
// from the url based on the route filename and return the response
// depending on the request method

/**
 * @deprecated this is just a placeholder for now
 */
export const get = async (url: string) => {
  // TODO: get route file based on the url
  // TODO: import loader from file
  // TODO: get params from url based on the route filename
  // const response = await loader({
  //   request: new Request(`http://app.com/${url}`),
  //   params: {},
  //   context: {},
  // })
  // return response
}

/**
 * Parse the data object into a FormData object
 *
 * @param data
 * @returns
 */
export function parseFormData<T extends object>(data: T) {
  let body = new FormData()

  Object.keys(data).forEach(key => {
    body.append(key, String(data[key as keyof typeof data]))
  })

  return body
}

/**
 * Returns the authorization header for the given mode and accountId, if no
 * accountId is provided it will create an account. If no mode is provided it
 * will use the dev mode
 */
export const authorize = async (props?: {
  /**
   * @default 'dev'
   */
  mode?: Mode
  accountId?: string
}) => {
  let {mode = 'dev', accountId} = props || {}

  if (!accountId) {
    accountId = (await db.account()).id
  }

  if (mode === 'dev') {
    if (!env.DEV_MODE_ENABLED) {
      throw new Error('DEV_MODE_ENABLED should bre enabled during tests')
    }

    return {
      Authorization: `Bearer ${env.DEV_API_KEY}`,
    }
  }

  const api = await db.api({mode, accountId})

  return {
    Authorization: `Bearer ${api.key}`,
  }
}
