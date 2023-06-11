import type {AxiosInstance} from 'axios'

import type {
  CancelBodyParams,
  CancelResult,
  CreateBodyParams,
  CreateResult,
  ListResult,
  RetrieveResult,
  UpdateBodyParams,
  UpdateResult,
} from './types'

export class PaymentIntents {
  private client: AxiosInstance

  constructor(client: AxiosInstance) {
    this.client = client
  }

  async create(params: CreateBodyParams) {
    const request = await this.client.post<CreateResult>(
      '/payment-intents',
      params,
    )
    return request.data
  }

  async retrieve(id: string) {
    const request = await this.client.get<RetrieveResult>(
      `/payment-intents/${id}`,
    )
    return request.data
  }

  async list() {
    const request = await this.client.get<ListResult>('/payment-intents')
    return request.data
  }

  async update(id: string, params: UpdateBodyParams) {
    const request = await this.client.post<UpdateResult>(
      `/payment-intents/${id}`,
      params,
    )
    return request.data
  }

  async cancel(id: string, params: CancelBodyParams = {}) {
    const request = await this.client.post<CancelResult>(
      `/payment-intents/${id}/cancel`,
      params,
    )
    return request.data
  }
}
