import '../../server/utils/polyfill'
import {NextApiRequest, NextApiResponse} from 'next'
import cors from 'nextjs-cors'
import {createNextRouter} from '@ts-rest/next'

import {contract, appRouter} from '../../server'
import {ResponseValidationError} from '@ts-rest/core'
import {logger} from 'logger'

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
      logger.error(error)
      if (error instanceof ResponseValidationError) {
        return res.status(500).json({message: 'Internal Server Error'})
      }
    },
  })(req, res)
}

export default handler
