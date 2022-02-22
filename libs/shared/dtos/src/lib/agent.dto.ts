import { AgentExecutionDto } from './agent-execution.dto';
import { AgentConfigurationDto } from './agent-configuration.dto';

export interface AgentDto {
  id: string;
  name: string;
  configuration: AgentConfigurationDto;
  executions: AgentExecutionDto[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
