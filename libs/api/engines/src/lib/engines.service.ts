import { Injectable } from '@nestjs/common';
import { ExchangeConnector, ExchangesService } from '@cta/api/exchanges';
import { HttpService } from '@nestjs/axios';
import { AgentConfigurationEntity } from '@cta/api/agents';
import {
  AgentConfig,
  AgentEndpointConfig,
  AgentGridConfig,
  AgentScriptConfig,
  AgentType,
} from '@cta/shared/dtos';
import { ExecutionEngine } from './execution-engines/execution-engine';
import { AgentDataEngine } from './data-engines/agent-data-engine';
import { GridExecutionEngine } from './execution-engines/grid-execution-engine';
import { EndpointExecutionEngine } from './execution-engines/endpoint-execution-engine';
import { ScriptExecutionEngine } from './execution-engines/script-execution-engine';
import { BackTestDataEngine } from './data-engines/back-test-data-engine';
import { DataEngine } from './data-engines/data-engine';

@Injectable()
export class EnginesService {
  constructor(
    private readonly exchangesService: ExchangesService,
    private readonly httpService: HttpService
  ) {}

  async getAgentEngine(
    userId: string,
    agentConfiguration: AgentConfigurationEntity
  ): Promise<ExecutionEngine<AgentDataEngine, AgentConfig>> {
    const connector = await this.exchangesService.getConnector(
        userId,
        agentConfiguration.exchangeType
      ),
      dataEngine = new AgentDataEngine(connector);

    return this.getEngine(agentConfiguration, connector, dataEngine);
  }

  async getBackTestEngine(
    userId: string,
    agentConfiguration: AgentConfigurationEntity
  ): Promise<ExecutionEngine<BackTestDataEngine, AgentConfig>> {
    const connector = await this.exchangesService.getConnector(
        userId,
        agentConfiguration.exchangeType
      ),
      dataEngine = new BackTestDataEngine(connector);

    return this.getEngine(agentConfiguration, connector, dataEngine);
  }

  private getEngine<D extends DataEngine>(
    agentConfiguration: AgentConfigurationEntity,
    connector: ExchangeConnector,
    dataEngine: D
  ): ExecutionEngine<D, AgentConfig> {
    let engine: ExecutionEngine<D, AgentConfig>;

    switch (agentConfiguration.type) {
      case AgentType.GRID:
        engine = new GridExecutionEngine(
          agentConfiguration.config as AgentGridConfig,
          connector,
          dataEngine
        );
        break;
      case AgentType.ENDPOINT:
        engine = new EndpointExecutionEngine(
          agentConfiguration.config as AgentEndpointConfig,
          connector,
          dataEngine,
          this.httpService
        );
        break;
      case AgentType.SCRIPT:
        engine = new ScriptExecutionEngine(
          agentConfiguration.config as AgentScriptConfig,
          connector,
          dataEngine
        );
        break;
      default:
        throw new Error(
          `Error while trying to execute agent with agentConfiguration:${agentConfiguration.id}, unknown agent type '${agentConfiguration.type}'`
        );
    }

    return engine;
  }
}
