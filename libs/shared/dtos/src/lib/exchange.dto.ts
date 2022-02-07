export enum ExchangeType {
  BINANCE = 'binance',
  COINBASE = 'coinbase'
}

export type ExchangeConfig = BinanceConfig | CoinbaseConfig;

export type BinanceConfig = {
  apiKey: string,
  secretKey: string
}

export type CoinbaseConfig = {
  apiKey: string,
  secretKey: string
}

export interface ExchangeDto {
  id: string;
  type: ExchangeType;
  config: ExchangeConfig;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
