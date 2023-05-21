import {format, logger} from 'logger'
import type {
  DefaultBodyType,
  PathParams,
  ResponseComposition,
  RestContext,
  RestRequest,
} from 'msw'

/**
 * Log mocked data to the console.
 *
 * @param message - Message to log.
 * @param data - Any json object to log.
 */
export async function logMockedData(message: string, data?: object) {
  logger.info(`🔶 ${format.dim(`mocked ${format.reset.bold(message)}`)}`)
  if (data) {
    logger.debug(
      format.dim(
        `     data ${format.reset.hex('#ff9600')(JSON.stringify(data))}`,
      ),
    )
  }
}

/**
 * Skip mock for the given request.
 * @param req
 * @param res
 * @param ctx
 * @returns
 */
export async function skip(
  req: RestRequest<DefaultBodyType, PathParams>,
  res: ResponseComposition<DefaultBodyType>,
  ctx: RestContext,
) {
  console.info(`⏩ mock request skipped: ${req.url.href}`)

  // Perform an original request to the intercepted request URL
  const originalResponse = await ctx.fetch(req)
  const originalResponseData = await originalResponse.json()

  console.debug('⏩ original response:', originalResponseData)

  return res(ctx.status(200), ctx.json(originalResponseData))
}
