export type CashierConfig = {
  maxNetworkRetries?: number;
  timeout?: number;
  host?: string;
  port?: number;
  telemetry?: boolean;
};

export type PaymentIntent = {
  id: string;
};

export class PaymentIntents {
  async create(params: Omit<PaymentIntent, "id">) {
    // TODO: create payment intent on a real server
    const paymentIntent: PaymentIntent = {
      id: "1231",
    };
    return paymentIntent;
  }

  async retrieve(id: string) {
    // TODO: retrieve payment intent from a real server
    if (id === "123") {
      return {
        id: "123",
      } as PaymentIntent;
    }
    return undefined;
  }
}

export default class Cashier {
  public paymentIntents: PaymentIntents;
  private config: CashierConfig;

  constructor(apiKey: string, config: CashierConfig = {}) {
    this.config = config;
    this.paymentIntents = new PaymentIntents();
  }
}
