/**
 * This file is used to run the Next.js API routes in a Node.js environment
 * so that we can test them with Vitest during our integration tests.
 *
 * It is based on the following npm package:
 * https://www.npmjs.com/package/next-test-api-routes
 *
 * The original package is not compatible with Next.js 13, so we had to
 * make some changes to make it work.
 */

import {beforeAll, afterAll} from 'vitest'
import http, {RequestListener} from 'http'
import {globSync} from 'glob'
import path from 'path'
import fs from 'fs'
import {apiResolver} from 'next/dist/server/api-utils/node'
import supertest from 'supertest'

const rootPath = path.resolve(__dirname, '..')

const nextPagesDirectory = fs.existsSync(`${rootPath}/pages`)
  ? `${rootPath}/pages`
  : `${rootPath}/src/pages`

const handlers = globSync(`${nextPagesDirectory}/api/**/*.+(ts|js)`).map(
  handler => handler.slice(nextPagesDirectory.length, -3),
)

const mapping: Record<string, unknown> = {}

beforeAll(async () => {
  await Promise.all(
    handlers.map(async handler => {
      const key = handler.endsWith('/index') ? handler.slice(0, -6) : handler // handle index routes
      try {
        // eslint-disable-next-line @next/next/no-assign-module-variable
        const module = await import(`${nextPagesDirectory}${handler}`)
        mapping[key] = module.default
      } catch (error) {
        mapping[key] = error
      }
    }),
  )
})

// Function that will receive two parameters, one is the list of files the NextJS API has and the second is the URL that is being requested.
// The function will return the route that matches the URL and the parameters that are being passed to the route.
export function getDynamicRoute(routes: string[], url: URL) {
  const urlSplit = url.pathname.split('/').filter(Boolean)

  for (const route of routes) {
    const routeParams: Record<string, string[]> = {}
    const routeSplit = route.split('/').filter(Boolean)

    for (let index = 0; index < routeSplit.length; index++) {
      const routePath = routeSplit[index]
      const urlPath = urlSplit[index]

      // Regex that matches [...param]
      const regex = /\[\.{3}?([a-zA-Z0-9-_]+)\]/

      if (regex.test(routePath)) {
        const param = routePath.match(regex)![1]
        if (!routeParams[param]) {
          routeParams[param] = []
        }

        for (let urlIndex = index; urlIndex < urlSplit.length; urlIndex++) {
          const element = urlSplit[urlIndex]
          routeParams[param].push(element)
        }
      } else if (routePath !== urlPath) {
        break // if the path does not match, check a new route
      }

      if (index === routeSplit.length - 1) {
        return {
          route,
          routeParams,
        }
      }
    }
  }
}

function getHandler(url: URL) {
  const handler = mapping[url.pathname]

  if (handler) {
    return {handler}
  }

  const routes = Object.keys(mapping)
  const dynamicRoutes = routes.filter(
    route => route.includes('[') && route.includes(']'),
  )

  const dynamicRounte = getDynamicRoute(dynamicRoutes, url)
  const {route, routeParams} = dynamicRounte || {route: '', routeParams: {}}

  return {
    handler: mapping[route],
    routeParams,
  }
}

const requestHandler: RequestListener = (request, response) => {
  if (!request.url) {
    throw new Error('Request URL is undefined')
  }

  const url = new URL('http://locahost' + request.url!)
  const params = url.searchParams
  const query = Object.fromEntries(params)
  const {handler, routeParams} = getHandler(url)

  return apiResolver(
    Object.assign(request, {connection: {remoteAddress: '127.0.0.1'}}),
    response,
    {...query, ...routeParams},
    handler,
    undefined!,
    true,
  )
}

export const server = http.createServer(requestHandler)
export const request = supertest(server)
afterAll(() => {
  server.close() // don't forget to close your server after your tests
})
