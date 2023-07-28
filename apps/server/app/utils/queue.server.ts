import {
  Queue as BullQueue,
  UnrecoverableError,
  Worker,
  type Processor,
  type QueueOptions,
  type WorkerOptions,
} from 'bullmq'
import {format, logger} from 'logger'

import {redis} from './redis.server'

type RegisteredQueue = {
  queue: BullQueue
  worker: Worker
}

declare global {
  var __registeredQueues: Record<string, RegisteredQueue> | undefined
}

const registeredQueues =
  global.__registeredQueues || (global.__registeredQueues = {})

export function createQueue<Payload>(
  name: string,
  handler: Processor<Payload>,
  options: {
    queue?: Omit<QueueOptions, 'connection'>
    worker?: Omit<WorkerOptions, 'connection'>
  } = {},
): BullQueue<Payload> {
  if (registeredQueues[name]) {
    return registeredQueues[name].queue
  }

  // Bullmq queues are the storage container managing jobs.
  const queue = new BullQueue<Payload>(name, {
    ...options.queue,
    connection: redis,
  })

  // Workers are where the meat of our processing lives within a queue.
  // They reach out to our redis connection and pull jobs off the queue
  // in an order determined by factors such as job priority, delay, etc.
  // The scheduler plays an important role in helping workers stay busy.
  const worker = new Worker<Payload>(name, handler, {
    ...options.worker,
    connection: redis,
  })

  worker.on('failed', async (job, err) => {
    if (err instanceof UnrecoverableError) {
      return logger.error(
        `[${format.yellow(name)}][${format.magenta(
          job?.id,
        )}] ⏹ Job has failed: ${format.red(err.message)}`,
      )
    }

    if (job?.opts.attempts && job?.attemptsMade < job?.opts.attempts) {
      return logger.verbose(
        `[${format.yellow(name)}](${format.magenta(
          job?.id,
        )}) ♺ Job rescheduled: ${err.message}`,
      )
    }

    return logger.error(
      `[${format.yellow(name)}](${format.magenta(job?.id)}) ⚰︎ Job failed: ${
        err.message
      }`,
    )
  })

  worker.on('completed', async (job, result) => {
    logger.verbose(
      `[${format.yellow(name)}](${format.magenta(job?.id)}) ✓ Job completed`,
    )
  })

  worker.on('active', async job => {
    logger.verbose(
      `[${format.yellow(name)}](${format.magenta(job?.id)}) ▸ Job started`,
    )
  })

  registeredQueues[name] = {queue, worker}

  return queue
}
