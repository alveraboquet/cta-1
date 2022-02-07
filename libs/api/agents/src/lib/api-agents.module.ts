import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AgentEntity } from './agent.entity';
import { AgentsService } from './agents.service';
import { AgentsController } from './agents.controller';
import { AgentConfigurationsModule } from './agent-configurations/agent-configurations.module';
import { AgentExecutionsModule } from './agent-executions/agent-executions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AgentEntity]),
    AgentConfigurationsModule,
    AgentExecutionsModule,
  ],
  controllers: [AgentsController],
  providers: [
    AgentsService,
    Logger,
  ],
  exports: [AgentConfigurationsModule],
})
export class ApiAgentsModule {}
