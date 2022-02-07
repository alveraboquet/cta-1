import { AgentScriptConfig } from '@cta/shared/dtos';
import { ExecutionEngine } from './execution-engine';
import { DataEngine } from '../data-engines/data-engine';

export class ScriptExecutionEngine<
  D extends DataEngine
> extends ExecutionEngine<D, AgentScriptConfig> {
  execute(): Promise<any> {
    return Promise.resolve(undefined);
  }
}
