import {rest, type MockedRequest, type RestHandler} from 'msw'

import {env} from '../app/utils/env.server'
import {logMockedData} from './utils'

const BITCOIN_CORE_URL = `${env.BITCOIN_CORE_CONNECTION_STRING.protocol}://${env.BITCOIN_CORE_CONNECTION_STRING.host}`

export const handlers = [
  // 🍚 Mock the Bitcoin Core API
  rest.post(BITCOIN_CORE_URL, async (req, res, ctx) => {
    // Log the ID of the mocked request on the console.log
    const data = await req.json()
    await logMockedData(`POST ${BITCOIN_CORE_URL}`, data)

    switch (data.method) {
      case 'createwallet':
        if (data.params.wallet_name === 'already-exists') {
          return res(
            ctx.json({
              result: null,
              error: {
                code: -4,
                message:
                  "Wallet file verification failed. Failed to create database path '/home/bitcoin/.bitcoin/regtest/wilson'. Database already exists.",
              },
              id: 'create-wallet-...',
            }),
          )
        }
        return res(
          ctx.json({
            result: {name: data.params.wallet_name, warning: ''},
            error: null,
            id: 'create-wallet-wilson',
          }),
        )

      case 'getdescriptorinfo':
        return res(
          ctx.json({
            result: {
              descriptor:
                'addr(bcrt1qtfjrpdwcxa7et498ead2gwxrnscl8eaaxvdxzp)#hjw9tktm',
              checksum: 'hjw9tktm',
              isrange: false,
              issolvable: false,
              hasprivatekeys: false,
            },
            error: null,
            id: data.params.id,
          }),
        )

      default:
        return res(ctx.json({}))
    }
  }),

  rest.post(
    `${BITCOIN_CORE_URL}/wallet/:wallet_name`,
    async (req, res, ctx) => {
      // Log the ID of the mocked request on the console.log
      const data = await req.json()
      await logMockedData(`POST ${BITCOIN_CORE_URL}/wallet/:wallet_name`, data)

      switch (data.method) {
        case 'getdescriptorinfo':
          return res(
            ctx.json({
              result: {
                descriptor:
                  'addr(bcrt1qtfjrpdwcxa7et498ead2gwxrnscl8eaaxvdxzp)#hjw9tktm',
                checksum: 'hjw9tktm',
                isrange: false,
                issolvable: false,
                hasprivatekeys: false,
              },
              error: null,
              id: data.params.id,
            }),
          )

        case 'importdescriptors':
          return res(
            ctx.json({
              result: [
                {
                  success: true,
                  warnings: '',
                  error: null,
                },
              ],
              error: null,
              id: data.params.id,
            }),
          )

        case 'listunspent':
          return res(
            ctx.json({
              result: [
                {
                  amount: 0.0001,
                  confirmations: 0,
                },
                {
                  amount: 0.0001,
                  confirmations: 2,
                },
                {
                  amount: 0.0001,
                  confirmations: 6,
                },
              ],
              error: null,
              id: data.params.id,
            }),
          )

        default:
          return res(ctx.json({}))
      }
    },
  ),
] satisfies Array<RestHandler<MockedRequest>>
