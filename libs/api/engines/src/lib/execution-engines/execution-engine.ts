import { ExchangeConnector } from '@cta/api/exchanges';
import { AgentConfig } from '@cta/shared/dtos';
import { DataEngine } from '../data-engines/data-engine';

export abstract class ExecutionEngine<D extends DataEngine, C extends AgentConfig> {
  constructor(
    protected readonly config: C,
    protected readonly connector: ExchangeConnector,
    readonly dataEngine: D,
  ) {}

  abstract execute(): Promise<any>;
}

