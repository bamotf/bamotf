import {rest} from 'msw'
import type {RestHandler, MockedRequest} from 'msw'
import {logMockedData} from './utils'

export const handlers = [
  // Mock example for development purposes
  rest.get(
    'https://jsonplaceholder.typicode.com/todos/:id',
    async (req, res, ctx) => {
      // Log the ID of the mocked request on the console.log
      await logMockedData(
        'GET https://jsonplaceholder.typicode.com/todos/:id',
        req.params,
      )

      // Return a fake response
      return res(
        ctx.json({
          userId: 1,
          id: 1,
          title: 'THIS IS A MOCKED RESPONSE 🕺',
          completed: true,
        }),
      )
    },
  ),
] satisfies Array<RestHandler<MockedRequest>>
