import { AgentExecutionResult } from '@cta/shared/dtos';

export type BackTestExecutionResult = {
  [agentId: string]: { [date: string]: AgentExecutionResult };
};

export interface BackTestExecutionDto {
  id: string;
  result: BackTestExecutionResult;
  createdAt: Date;
  updatedAt: Date;
}
