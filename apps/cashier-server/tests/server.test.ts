import {getDynamicRoute} from './server'
import {expect, describe, it} from 'vitest'

describe('dynamic-route', () => {
  it('should return the dynamic route', () => {
    const routes = ['/api/[...ts-rest]']
    const url = new URL(
      'http://example.com/api/payment-intents/1/another-route?foo=bar',
    )
    const result = getDynamicRoute(routes, url)

    expect(result).to.deep.equal({
      route: '/api/[...ts-rest]',
      routeParams: {'ts-rest': ['payment-intents', '1', 'another-route']},
    })
  })

  it('should not return a route', () => {
    const routes = ['/api/[...ts-rest]']
    const url = new URL('http://example.com/')
    const result = getDynamicRoute(routes, url)

    expect(result).toBeUndefined()
  })
})
