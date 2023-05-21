import {rest} from 'msw'
import type {RestHandler, MockedRequest} from 'msw'
import {logMockedData} from './utils'

export const handlers = [
  //
  rest.post(
    'http://localhost:3000/api/payment-intents',
    async (req, res, ctx) => {
      const data = await req.json()

      if (req.headers.get('Authorization') !== 'Bearer test-token') {
        return res(
          ctx.status(401),
          ctx.body("You don't have permission to access this resource."),
        )
      }

      await logMockedData(
        'POST http://localhost:3000/api/payment-intents',
        data,
      )

      // Return a fake response
      return res(
        ctx.json({
          id: 1,
          ...data,
        }),
      )
    },
  ),
] satisfies Array<RestHandler<MockedRequest>>
