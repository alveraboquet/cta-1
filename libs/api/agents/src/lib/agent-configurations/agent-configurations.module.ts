import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentConfigurationsController } from './agent-configurations.controller';
import { AgentConfigurationEntity } from './agent-configuration.entity';
import { AgentConfigurationsService } from './agent-configurations.service';

@Module({
  imports: [TypeOrmModule.forFeature([AgentConfigurationEntity])],
  controllers: [AgentConfigurationsController],
  providers: [AgentConfigurationsService],
  exports: [AgentConfigurationsService]
})
export class AgentConfigurationsModule {}
