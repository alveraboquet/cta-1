import { OrderCommand } from '@cta/shared/dtos';
import { AgentConfigurationDto } from './agent-configuration.dto';

export type AgentExecutionResult = OrderCommand | { [key: string]: any };

export interface AgentExecutionDto {
  id: string;
  result: AgentExecutionResult;
  createdAt: Date;
  updatedAt: Date;
  agentConfiguration: AgentConfigurationDto;
}
