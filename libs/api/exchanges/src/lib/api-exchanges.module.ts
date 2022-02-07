import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExchangeEntity } from './exchange.entity';
import { ExchangesController } from './exchanges.controller';
import { ExchangesService } from './exchanges.service';
import { ExchangeConnectorsModule } from './exchange-connectors/exchange-connectors.module';

@Module({
  imports: [TypeOrmModule.forFeature([ExchangeEntity]), ExchangeConnectorsModule],
  controllers: [ExchangesController],
  providers: [Logger, ExchangesService],
  exports: [ExchangesService],
})
export class ApiExchangesModule {}
