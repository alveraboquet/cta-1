import { Module } from '@nestjs/common';
import { EnginesService } from './engines.service';
import { ApiExchangesModule } from '@cta/api/exchanges';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [],
  providers: [EnginesService],
  exports: [EnginesService],
  imports: [HttpModule, ApiExchangesModule],
})
export class ApiEnginesModule {}
