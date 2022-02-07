import { OrderCommand } from '@cta/shared/dtos';

export type ExchangeHistoricalData = {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export abstract class ExchangeConnector {
  abstract getBalance(): Promise<any>;
  abstract getHistoricalData(
    symbol: string,
    interval: string,
    startDate?: Date,
    endDate?: Date,
    limit?: number
  ): Promise<Map<number, ExchangeHistoricalData>>;
  abstract getLastPrice(symbol: string): Promise<number>;
  abstract createOrder(command: OrderCommand): Promise<any>;
}
