import {format, logger} from 'logger'

/**
 * Logs a specific for a queue.
 *
 * @param queueName Queue name
 * @param id Job ID
 * @returns
 */
export function QueueLog(queueName: string, id: string) {
  const name = {
    started: '▸ Job started',
    completed: '✓ Job completed',
    rescheduled: '♺ Job rescheduled',
  }

  return (status: keyof typeof name) => {
    logger.info(
      `[${format.yellow(queueName)}] ${name[status]}: ${format.magenta(id)}`,
    )
  }
}
