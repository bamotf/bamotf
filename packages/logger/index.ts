import winston from 'winston'
import format from 'chalk'

// Create a Winston logger - passing in the Logtail transport
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
})

if (process.env.NODE_ENV === 'production') {
  // If we're in production, we'll want to send our logs to an external service
  // like Logtail or Datadog. To do that, we'll need to install the transport
  // and create a client.
  // import {Logtail} from '@logtail/node'
  // import {LogtailTransport} from '@logtail/winston'
  // const logtail = new Logtail(env.LOGTAIL_SOURCE_TOKEN)
  // logger.add(new LogtailTransport(logtail))
}

export {
  /**
   * A logger tool that can be used to log messages to the logger service
   */
  logger,

  /**
   * A terminal output formatting with ANSI colors
   */
  format,
}
