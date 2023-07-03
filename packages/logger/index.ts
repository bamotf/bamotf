import format from 'chalk'
import winston from 'winston'

const logger = winston.createLogger({
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  level: process.env.LOG_LEVEL || 'info',
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
})

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
