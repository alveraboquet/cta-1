import { DataEngine } from './data-engine';
import { ExchangeHistoricalData } from '@cta/api/exchanges';

export class AgentDataEngine extends DataEngine {

  async getLastPrice(symbol: string): Promise<number> {
    return this.connector.getLastPrice(symbol);
  }

  async getHistoricalData(symbol: string, interval: string): Promise<Map<number, ExchangeHistoricalData>> {
    return this.connector.getHistoricalData(symbol, interval);
  }
}
