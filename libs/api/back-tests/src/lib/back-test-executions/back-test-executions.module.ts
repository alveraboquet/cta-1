import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule, BullModuleOptions } from '@nestjs/bull';
import { BackTestExecutionEntity } from './back-test-execution.entity';
import { BackTestExecutionsService } from './back-test-executions.service';
import { BackTestsExecutionsConsumer } from './back-tests-executions.consumer';
import { BackTestConfigurationsModule } from '../back-test-configurations/back-test-configurations.module';
import { ApiEnginesModule } from '@cta/api/engines';
//import { AgentConfigurationsModule } from '../../../../agents/src/lib/agent-configurations/agent-configurations.module';
import { ApiAgentsModule } from '@cta/api/agents';

const backTestsExecutionsQueueConfig = {
  name: 'back-tests-executions',
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: true,
  },
  settings: {
    lockDuration: 300000,
  },
} as BullModuleOptions;

@Module({
  imports: [
    TypeOrmModule.forFeature([BackTestExecutionEntity]),
    BullModule.registerQueue(backTestsExecutionsQueueConfig),
    BackTestConfigurationsModule,
    ApiEnginesModule,
    ApiAgentsModule
  ],
  providers: [Logger, BackTestExecutionsService, BackTestsExecutionsConsumer],
  exports: [BackTestExecutionsService],
})
export class BackTestExecutionsModule {}
