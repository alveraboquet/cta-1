import { Injectable } from '@nestjs/common';
import { ExchangeType } from '@cta/shared/dtos';
import { ExchangeEntity } from '../exchange.entity';
import { ExchangeConnector } from '@cta/api/exchanges';
import { BinanceExchangeConnector } from './binance-exchange-connector';
import { CoinbaseExchangeConnector } from './coinbase-exchange-connector';

@Injectable()
export class ExchangeConnectorsService {
  constructor() {}

  async get(exchange: ExchangeEntity): Promise<ExchangeConnector> {
    let result: ExchangeConnector;

    switch (exchange.type) {
      case ExchangeType.BINANCE:
        result = new BinanceExchangeConnector(exchange.config);
        break;
      case ExchangeType.COINBASE:
        result = new CoinbaseExchangeConnector(exchange.config);
        break;
      default:
        throw new Error(
          `Unable to retrieve exchange connector for exchange:${exchange.id} of type '${exchange.type}'`
        );
    }

    return result;
  }
}
