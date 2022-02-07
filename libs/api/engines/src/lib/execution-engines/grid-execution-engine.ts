import { AgentGridConfig } from '@cta/shared/dtos';
import { ExecutionEngine } from './execution-engine';
import { DataEngine } from '../data-engines/data-engine';
import { GridBot } from './grid-bot';

export class GridExecutionEngine<D extends DataEngine> extends ExecutionEngine<
  D,
  AgentGridConfig
> {
  gridAgent: GridBot;

  async execute(): Promise<any> {
    if (!this.gridAgent) {
      this.gridAgent = new GridBot(this.config);
    }
    const lastPrice = await this.dataEngine.getLastPrice(this.config.pair);
    return this.gridAgent.execute(lastPrice);
  }
}
