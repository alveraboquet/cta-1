import { ExchangeConnector, ExchangeHistoricalData } from '@cta/api/exchanges';
import { CoinbaseConfig } from '@cta/shared/dtos';
import { OrderCommand } from '@cta/shared/dtos';

// TODO
export class CoinbaseExchangeConnector implements ExchangeConnector {
  constructor(config: CoinbaseConfig) {}

  getHistoricalData(
    symbol: string,
    interval: string,
    startDate?: Date,
    endDate?: Date,
    limit?: number
  ): Promise<Map<number, ExchangeHistoricalData>> {
    return Promise.resolve(undefined);
  }

  getLastPrice(symbol: string): Promise<number> {
    return Promise.resolve(undefined);
  }

  createOrder(command: OrderCommand): Promise<void> {
    return Promise.resolve(undefined);
  }

  getBalance(): Promise<any> {
    return Promise.resolve(undefined);
  }
}
