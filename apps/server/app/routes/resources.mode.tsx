import {json, redirect, type ActionArgs} from '@remix-run/node'

import {requireUserId} from '~/utils/auth.server'
import {enabledModes, setModeSession, type Mode} from '~/utils/mode.server'

/**
 * Set the mode in which the user is viewing the data for the current session.
 */
export async function action({request}: ActionArgs) {
  await requireUserId(request)

  const formData = await request.formData()
  const mode = formData.get('mode') as Mode | null

  if (!mode || enabledModes[mode] === undefined) {
    throw new Response(`Invalid mode: ${mode}`, {
      status: 400,
      statusText: 'Invalid mode',
    })
  }

  if (!enabledModes[mode]) {
    throw new Response(`Mode disabled: ${mode}`, {
      status: 400,
      statusText: 'Mode disabled',
    })
  }

  return json(null, {
    headers: {
      'Set-Cookie': await setModeSession(request, mode),
    },
  })
}

export default function ModePage() {
  return null
}
