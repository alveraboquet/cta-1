import { BackTestDto } from './back-test.dto';
import { AgentDto } from '@cta/shared/dtos';

export interface BackTestConfigurationDto {
  id: string;
  agents: Partial<AgentDto>[]
  version: number;
  createdAt: Date;
  backTest: Partial<BackTestDto>;
}
