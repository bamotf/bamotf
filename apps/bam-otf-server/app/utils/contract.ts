import type {LoaderArgs} from '@remix-run/node'
import {badRequest} from 'remix-utils'
import type {z, ZodTypeAny} from 'zod'

export type ApiRoute = {
  summary?: string
  description?: string
  deprecated?: boolean
  pathParams?: ZodTypeAny
  queryParams?: ZodTypeAny
}

/**
 * A query endpoint. In REST terms, one using GET.
 */
export type QueryRoute = ApiRoute

/**
 * A mutation endpoint. In REST terms, one using POST, PUT,
 * PATCH, or DELETE.
 */
export type MutationRoute = ApiRoute & {
  contentType?: 'application/json' | 'multipart/form-data'
  body?: ZodTypeAny
}

/**
 * A union of all possible endpoint types.
 */
export type Route = QueryRoute | MutationRoute

/**
 * A router (or contract) in @ts-rest is a collection of more routers or
 * individual routes
 */
export type AppRouter = {
  loader?: QueryRoute
  action?: MutationRoute
}

/**
 * Parse a zod schema and throw an error if it fails
 * @param args
 * @returns
 */
function parseSchema<T extends ZodTypeAny>({
  schema,
  data,
  name,
}: {
  schema?: T
  data: unknown
  name: string
}) {
  if (!schema) {
    return {data: undefined}
  }

  const parsed = schema.safeParse(data)
  if (!parsed.success) {
    const result = JSON.stringify({
      name,
      issues: parsed.error.issues,
    })
    throw badRequest(result)
  }
  return parsed
}

export const createContract = <T extends AppRouter>(routes: Prettify<T>) => {
  return {
    loader: (args: Partial<LoaderArgs>) => {
      if (!routes.loader) {
        throw new Error('Missing loader route contract')
      }

      const {pathParams, queryParams} = routes.loader

      // Parse path params
      const path = parseSchema({
        schema: pathParams,
        data: args.params,
        name: 'path',
      })

      // Parse query params
      // TODO: get query params from the request url
      const query = parseSchema({
        schema: queryParams,
        data: args.params,
        name: 'query',
      })

      return {
        path: path.data,
        query: query.data,
      } as {
        // HACK: I couldn't find a way to make those types work properly
        // @ts-expect-error
        path: z.infer<T['loader']['pathParams']>
        // @ts-expect-error
        query: z.infer<T['loader']['queryParams']>
        // @ts-expect-error
        body: z.infer<T['loader']['body']>
      }
    },
    action: async ({request, params}: Partial<LoaderArgs>) => {
      // get the method from the request
      if (!request) {
        throw new Error('Missing request parameter in the `.mutations` method')
      }

      const route = routes.action
      // Check if the method has a contract
      if (!route) {
        throw new Error('Missing loader route contract')
      }
      if (!('body' in route)) {
        throw new Error('Mutations can only be used on actions!')
      }

      const {pathParams, queryParams, body: bodyParams} = route

      // Parse path params
      const path = parseSchema({
        schema: pathParams,
        data: params,
        name: 'path',
      })

      const query = parseSchema({
        schema: queryParams,
        data: params,
        name: 'query',
      })

      // Parse body params
      // TODO: use the content type to parse the body
      let bodyData: object = {}
      try {
        let formData: FormData = new FormData()
        formData = await request.clone().formData()
        bodyData = Object.fromEntries(formData.entries())
      } catch (error) {
        try {
          bodyData = await request.json()
        } catch (error) {}
      }

      const body = parseSchema({
        schema: bodyParams,
        data: bodyData,
        name: 'body',
      })

      return {
        path: path.data,
        query: query.data,
        body: body.data,
      } as {
        // HACK: I couldn't find a way to make those types work properly
        // @ts-expect-error
        path: z.infer<T['action']['pathParams']>
        // @ts-expect-error
        query: z.infer<T['action']['queryParams']>
        // @ts-expect-error
        body: z.infer<T['action']['body']>
      }
    },
  }
}
