import { Module } from '@nestjs/common';
import { ExchangeConnectorsService } from './exchange-connectors.service';

@Module({
  providers: [ExchangeConnectorsService],
  exports: [ExchangeConnectorsService]
})
export class ExchangeConnectorsModule {}
