import { DataEngine } from './data-engine';
import { ExchangeHistoricalData } from '@cta/api/exchanges';

export class BackTestDataEngine extends DataEngine {
  currentDate: Date;

  private data = new Map<string, Map<number, ExchangeHistoricalData>>();

  async initData(symbols: string[], startDate: Date, finalDate: Date) {
    for (const symbol of symbols) {
      let lastDate = new Date(startDate);

      const symbolData = new Map();
      while (lastDate < finalDate) {
        const data = await this.connector.getHistoricalData(
          symbol,
          '1m',
          lastDate,
          finalDate
        );
        lastDate = new Date(Math.max(...Array.from(data.keys())));
        data.forEach((value, key) => symbolData.set(key, value));
      }

      this.data.set(symbol, symbolData);
    }
  }

  async getLastPrice(symbol: string): Promise<number> {
    return this.data.get(symbol).get(this.currentDate.getTime()).close;
  }

  async getHistoricalData(
    symbol: string,
    interval: string
  ): Promise<Map<number, ExchangeHistoricalData>> {
    return this.connector.getHistoricalData(symbol, interval, this.currentDate);
  }
}
