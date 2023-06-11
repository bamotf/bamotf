import {rest, type MockedRequest, type RestHandler} from 'msw'

import {logMockedData} from './utils'

export const handlers = [
  // Mock a successful POST /api/payment-intents request
  rest.post(
    'http://localhost:21000/api/payment-intents',
    async (req, res, ctx) => {
      const data = await req.json()

      if (req.headers.get('Authorization') !== 'Bearer test-token') {
        return res(
          ctx.status(401),
          ctx.body("You don't have permission to access this resource."),
        )
      }

      await logMockedData(
        'POST http://localhost:21000/api/payment-intents',
        data,
      )

      // Return a fake response
      return res(
        ctx.json({
          id: 1,
          ...data,
          createdAt: new Date().toString(),
          updatedAt: new Date().toString(),
          __meta__: {
            createdAt: 'date',
            updatedAt: 'date',
          },
        }),
      )
    },
  ),
] satisfies Array<RestHandler<MockedRequest>>
