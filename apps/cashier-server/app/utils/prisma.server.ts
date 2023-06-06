import {PrismaClient} from '@prisma/client'
import {format, logger} from 'logger'

import {env} from './env.server'

// export all types from from prisma client
export * from '@prisma/client'

declare global {
  // This prevents us from making multiple connections to the db when the
  // require cache is cleared.
  // eslint-disable-next-line
  var prisma: ReturnType<typeof getClient> | undefined
}

const LOG_THRESHOLD = 15

function getClient(createClient: () => PrismaClient): PrismaClient {
  let client = global.prisma
  if (!client) {
    // eslint-disable-next-line no-multi-assign
    client = global.prisma = createClient()
  }
  return client
}

export const prisma = getClient(() => {
  logger.info(`Connecting to database...`)

  const client = new PrismaClient({
    log:
      env.NODE_ENV === 'test' || env.RUNNING_TESTS
        ? [{emit: 'stdout', level: 'error'}]
        : [
            {emit: 'event', level: 'query'},
            {emit: 'stdout', level: 'error'},
            {emit: 'stdout', level: 'info'},
            {emit: 'stdout', level: 'warn'},
          ],
    // rejectOnNotFound: {
    //   findFirst: {
    //     PaymentIntent: err => new Error('PaymentIntent not found'),
    //   },
    //   findUnique: {
    //     PaymentIntent: err => new Error('PaymentIntent not found'),
    //   },
    // },
  })

  client.$on('query', e => {
    if (e.duration < LOG_THRESHOLD) return

    const color =
      e.duration > 35
        ? 'red'
        : e.duration > 20
        ? 'yellow'
        : e.duration > 15
        ? 'blue'
        : 'green'

    const dur = format[color](`${e.duration}ms`)

    logger.info(`${format.magenta('prisma:query')} - ${dur} - ${e.query}`, {
      duration: e.duration,
    })
  })
  return client
})
