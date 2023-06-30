import {forbidden} from 'remix-utils'

import {requireUserId} from './auth.server'
import {prisma} from './prisma.server'

export async function requireUserWithPermission(
  name: string,
  request: Request,
) {
  const userId = await requireUserId(request)
  const user = await prisma.user.findFirst({
    where: {id: userId, roles: {some: {permissions: {some: {name}}}}},
  })
  if (!user) {
    throw forbidden({
      error: "You don't have access for this.",
      requiredRole: name,
    })
  }
  return user
}

export async function requireAdmin(request: Request) {
  return requireUserWithPermission('admin', request)
}
