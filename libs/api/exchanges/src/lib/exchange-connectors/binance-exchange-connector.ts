import { Spot } from '@binance/connector';
import { BinanceConfig, OrderCommand } from '@cta/shared/dtos';
import { ExchangeConnector, ExchangeHistoricalData } from './exchange-connector';

export class BinanceExchangeConnector implements ExchangeConnector {
  client: Spot;

  constructor(config: BinanceConfig) {
    this.client = new Spot(config.apiKey, config.secretKey, {
      baseURL: 'https://testnet.binance.vision',
    });
  }

  async getHistoricalData(
    symbol: string,
    interval: string,
    startDate?: Date,
    endDate?: Date,
    limit = 1000
  ): Promise<Map<number, ExchangeHistoricalData>> {
    const result = new Map<number, ExchangeHistoricalData>(),
      dataReq = await this.client.klines(symbol, interval, {
        startTime: startDate?.getTime(),
        endTime: endDate?.getTime(),
        limit,
      });

    for (const arr of dataReq.data) {
      result.set(arr[0], {
        open: parseFloat(arr[1]),
        high: parseFloat(arr[2]),
        low: parseFloat(arr[3]),
        close: parseFloat(arr[4]),
        volume: parseFloat(arr[5]),
      });
    }

    return result;
  }

  async getLastPrice(symbol: string): Promise<number> {
    const dataReq = await this.client.tickerPrice(symbol);
    return parseFloat(dataReq.data.price);
  }

  createOrder(command: OrderCommand): Promise<void> {
    return this.client.newOrder(command.symbol, command.side, command.type, {
      price: command.price,
      quantity: command.quantity,
      timeInForce: 'GTC',
    });
  }

  getBalance(): Promise<any> {
    // TODO
    return Promise.resolve(undefined);
  }
}
