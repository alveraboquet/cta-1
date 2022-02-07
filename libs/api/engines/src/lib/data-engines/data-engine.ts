import { ExchangeConnector, ExchangeHistoricalData } from '@cta/api/exchanges';

export abstract class DataEngine {
  constructor(
    protected readonly connector: ExchangeConnector
  ) {}

  abstract getLastPrice(symbol: string): Promise<number>;
  abstract getHistoricalData(symbol: string, interval: string): Promise<Map<number, ExchangeHistoricalData>>
}

