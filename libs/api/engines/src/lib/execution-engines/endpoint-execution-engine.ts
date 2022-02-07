import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { AgentEndpointConfig } from '@cta/shared/dtos';
import { ExchangeConnector } from '@cta/api/exchanges';
import { ExecutionEngine } from './execution-engine';
import { DataEngine } from '../data-engines/data-engine';

export class EndpointExecutionEngine<
  D extends DataEngine
> extends ExecutionEngine<D, AgentEndpointConfig> {
  constructor(
    protected readonly config: AgentEndpointConfig,
    protected readonly connector: ExchangeConnector,
    readonly dataEngine: D,
    protected readonly httpService: HttpService
  ) {
    super(config, connector, dataEngine);
  }

  async execute(): Promise<any> {
    const data = await this.dataEngine.getHistoricalData('BNBUSDT', '1m'); // TODO

    const result = await firstValueFrom(
      this.httpService.post(this.config.endpoint, data)
    );

    return result.data;
  }
}
