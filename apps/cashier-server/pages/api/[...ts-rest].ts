import '~/api/utils/polyfill'
import {NextApiRequest, NextApiResponse} from 'next'
import cors from 'nextjs-cors'
import {createNextRouter} from '@ts-rest/next'
import {Prisma} from 'db'

import {contract, appRouter} from '~/api'
import {ResponseValidationError} from '@ts-rest/core'
import {logger} from 'logger'
import {env} from '~/api/utils'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Setup CORS
  await cors(req, res)

  // Handle incoming OpenAPI requests
  return createNextRouter(contract, appRouter, {
    responseValidation: true,
    errorHandler: (
      error: unknown,
      req: NextApiRequest,
      res: NextApiResponse,
    ) => {
      if (env.NODE_ENV === 'production') {
        logger.error(`Error handling for ${req.url}`, {req, res, error})
      }

      // TODO: check if the not found error is a Prisma error
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          return res.status(404).json(error.message)
        }
      }

      // if (error instanceof ResponseValidationError) {
      //   return res.status(500).json({message: 'Internal Server Error'})
      // }

      return res.status(500).json({message: 'Internal Server Error'})
    },
  })(req, res)
}

export default handler
