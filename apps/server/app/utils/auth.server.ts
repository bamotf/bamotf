import {json, redirect} from '@remix-run/node'
import {Authenticator} from 'remix-auth'
import {FormStrategy} from 'remix-auth-form'
import invariant from 'tiny-invariant'

import {prisma, type Password, type User} from '~/utils/prisma.server'
import {decrypt, encrypt} from './encryption.server'
import {env} from './env.server'
import {sessionStorage} from './session.server'

export type {User}

export const authenticator = new Authenticator<string>(sessionStorage, {
  sessionKey: 'sessionId',
})

const SESSION_EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 30

authenticator.use(
  new FormStrategy(async ({form}) => {
    const username = form.get('username')
    const password = form.get('password')

    invariant(typeof username === 'string', 'username must be a string')
    invariant(username.length > 0, 'username must not be empty')

    invariant(typeof password === 'string', 'password must be a string')
    invariant(password.length >= 6, 'password must be at least 6 characters')

    const user = await verifyUserPassword({username}, password)
    if (!user) {
      throw new Error('Invalid username or password')
    }
    const session = await prisma.session.create({
      data: {
        expirationDate: new Date(Date.now() + SESSION_EXPIRATION_TIME),
        userId: user.id,
      },
      select: {id: true},
    })

    return session.id
  }),
  FormStrategy.name,
)

/**
 * Requires a session from the request and returns the user ID.
 */
export async function requireUserId(
  request: Request,
  {redirectTo}: {redirectTo?: string | null} = {},
) {
  const requestUrl = new URL(request.url)
  redirectTo =
    redirectTo === null
      ? null
      : redirectTo ?? `${requestUrl.pathname}${requestUrl.search}`
  const loginParams = redirectTo
    ? new URLSearchParams([['redirectTo', redirectTo]])
    : null
  const failureRedirect = ['/login', loginParams?.toString()]
    .filter(Boolean)
    .join('?')
  const sessionId = await authenticator.isAuthenticated(request, {
    failureRedirect,
  })
  const session = await prisma.session.findFirst({
    where: {id: sessionId},
    select: {userId: true, expirationDate: true},
  })
  if (!session) {
    throw redirect(failureRedirect)
  }
  return session.userId
}

/**
 * Requires a session from the request and returns the user ID.
 */
export async function getUserId(request: Request) {
  const sessionId = await authenticator.isAuthenticated(request)
  if (!sessionId) return null
  const session = await prisma.session.findUnique({
    where: {id: sessionId},
    select: {userId: true},
  })
  if (!session) {
    // Perhaps their session was deleted?
    await authenticator.logout(request, {redirectTo: '/'})
    return null
  }
  return session.userId
}

export async function requireAnonymous(request: Request) {
  await authenticator.isAuthenticated(request, {
    successRedirect: '/',
  })
}

export async function resetUserPassword({
  username,
  password,
}: {
  username: User['username']
  password: string
}) {
  const hashedPassword = await encrypt(password)
  return prisma.user.update({
    where: {username},
    data: {
      password: {
        update: {
          hash: hashedPassword,
        },
      },
    },
  })
}

export async function signup({
  username,
  password,
  name,
}: {
  username: User['username']
  name: User['name']
  password: string
}) {
  const hashedPassword = await getPasswordHash(password)

  const session = await prisma.session.create({
    data: {
      expirationDate: new Date(Date.now() + SESSION_EXPIRATION_TIME),
      user: {
        create: {
          username,
          name,
          password: {
            create: {
              hash: hashedPassword,
            },
          },
        },
      },
    },
    select: {id: true, expirationDate: true},
  })
  return session
}

export async function getPasswordHash(password: string) {
  const hash = await encrypt(password)
  return hash
}

export async function verifyUserPassword(
  where: {username: User['username']} | {id: User['id']},
  password: Password['hash'],
) {
  const userWithPassword = await prisma.user.findUnique({
    where,
    select: {id: true, password: {select: {hash: true}}},
  })

  if (!userWithPassword || !userWithPassword.password) {
    return null
  }

  const isValid = await decrypt(password, userWithPassword.password.hash)

  if (!isValid) {
    return null
  }

  return {id: userWithPassword.id}
}

export async function requireValidApiKey(request: Request) {
  // Get the bearer token from the request
  const key = request.headers.get('Authorization')?.split(' ')[1]

  // Check if the bearer token matches the dev API key
  // and if so, return the default account
  if (env.DEV_MODE_ENABLED && key === env.DEV_API_KEY) {
    const account = await prisma.account.findFirst()
    if (!account) {
      throw new Error('No default account found')
    }

    return {
      mode: 'dev' as const,
      accountId: account.id,
    }
  }

  // if it isn't the dev API key, check if it's a valid API key
  const api = await prisma.api.findUnique({
    where: {
      key,
    },
    select: {
      mode: true,
      accountId: true,
    },
  })

  // If there is no bearer token or the token doesn't match the settings, throw an error
  if (!api) {
    throw json("You don't have permission to access this resource.", {
      status: 401,
      statusText: 'Unauthorized',
    })
  }

  return api
}
