import {createNextRoute} from '@ts-rest/next'
import {paymentIntentsRouter} from './payment-intents.routes'
import {contract} from './contract'

export const appRoutes = createNextRoute(contract, {
  paymentIntents: paymentIntentsRouter,
})
