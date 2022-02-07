import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule, BullModuleOptions } from '@nestjs/bull';
import { HttpModule } from '@nestjs/axios';
import { SchedulerRegistry } from '@nestjs/schedule';
import { ApiExchangesModule } from '@cta/api/exchanges';
import { ApiEnginesModule } from '@cta/api/engines';
import { AgentExecutionEntity } from './agent-execution.entity';
import { AgentExecutionsService } from './agent-executions.service';
import { AgentsExecutionsConsumer } from './agents-executions.consumer';
import { AgentConfigurationsModule } from '../agent-configurations/agent-configurations.module';

const agentsExecutionsQueueConfig = {
  name: 'agents-executions',
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
    TypeOrmModule.forFeature([AgentExecutionEntity]),
    BullModule.registerQueue(agentsExecutionsQueueConfig),
    HttpModule,
    ApiExchangesModule,
    ApiEnginesModule,
    AgentConfigurationsModule,
  ],
  providers: [Logger, SchedulerRegistry, AgentExecutionsService, AgentsExecutionsConsumer],
  exports: [AgentExecutionsService]
})
export class AgentExecutionsModule {}
