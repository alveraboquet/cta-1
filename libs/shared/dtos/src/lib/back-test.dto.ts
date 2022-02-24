import { BackTestExecutionDto } from './back-test-execution.dto';
import { BackTestConfigurationDto } from './back-test-configuration.dto';

export interface BackTestDto {
  id: string;
  name: string;
  configuration: Partial<BackTestConfigurationDto>;
  executions: BackTestExecutionDto[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
