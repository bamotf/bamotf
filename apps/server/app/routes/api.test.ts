import {afterEach, describe, expect, test, vi} from 'tests/base.fixture'

import {env} from '~/utils/env.server'
import {loader} from './api.payment-intents.$id._index'

afterEach(() => {
  vi.resetAllMocks()
})

describe('API Key Authentication', () => {
  test('should authorize request in dev environment', async ({faker}) => {
    const key = faker.string.alphanumeric(32)
    vi.spyOn(env, 'DEV_MODE_ENABLED', 'get').mockReturnValue(true)
    vi.spyOn(env, 'DEV_API_KEY', 'get').mockReturnValue(key)

    const {id} = await faker.db.paymentIntent({
      mode: 'dev',
    })

    let request = new Request(`http://app.com/api/payment-intents/${id}`, {
      method: 'GET',
      headers: {Authorization: `Bearer ${key}`},
    })

    const res = await loader({request, params: {id}, context: {}})
    expect(res.status).toEqual(200)
  })

  test('should not authorize request when dev mode is disabled', async ({
    faker,
  }) => {
    const key = faker.string.alphanumeric(32)
    vi.spyOn(env, 'DEV_MODE_ENABLED', 'get').mockReturnValue(false)
    vi.spyOn(env, 'DEV_API_KEY', 'get').mockReturnValue(key)

    const {id} = await faker.db.paymentIntent({
      mode: 'dev',
    })

    let request = new Request(`http://app.com/api/payment-intents/${id}`, {
      method: 'GET',
      headers: {Authorization: `Bearer ${key}`},
    })

    try {
      await loader({request, params: {id}, context: {}})
    } catch (res: unknown) {
      if (res instanceof Response) {
        expect(res.status).toEqual(401)
      }
    }
  })

  test('should authorize request with a database key', async ({faker}) => {
    const {key, accountId, mode} = await faker.db.api({mode: 'test'})
    const {id} = await faker.db.paymentIntent({
      mode,
      accountId,
    })

    let request = new Request(`http://app.com/api/payment-intents/${id}`, {
      method: 'GET',
      headers: {Authorization: `Bearer ${key}`},
    })

    const res = await loader({request, params: {id}, context: {}})
    expect(res.status).toEqual(200)
  })

  test('should not authorize a request', async ({faker}) => {
    const {id} = await faker.db.paymentIntent({
      mode: 'prod',
    })

    let request = new Request(`http://app.com/api/payment-intents/${id}`, {
      method: 'GET',
      headers: {Authorization: `Bearer invalid-key`},
    })

    try {
      await loader({request, params: {id}, context: {}})
    } catch (res: unknown) {
      if (res instanceof Response) {
        expect(res.status).toEqual(401)
      }
    }
  })
})
