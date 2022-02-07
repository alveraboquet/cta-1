import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AgentConfigurationDto } from '@cta/shared/dtos';
import { AgentEntity } from '../agent.entity';
import { AgentConfigurationsService } from './agent-configurations.service';
import { AgentConfigurationEntity } from './agent-configuration.entity';


@Controller('agents/configuration')
export class AgentConfigurationsController {
  constructor(
    private readonly agentConfigurationsService: AgentConfigurationsService
  ) {}

  @UseGuards(AuthGuard('firebase-jwt'))
  @Post('/:id')
  updateConfiguration(@Param('id') id: string, @Body() agentConfigurationDto: AgentConfigurationDto) {
    const agentConfiguration = new AgentConfigurationEntity(agentConfigurationDto);
    agentConfiguration.agent = new AgentEntity({ id });
    return this.agentConfigurationsService.save(agentConfiguration);
  }

  @UseGuards(AuthGuard('firebase-jwt'))
  @Get('/:id')
  findConfiguration(@Param('id') id: string) {
    return this.agentConfigurationsService.findLatest(id);
  }

}
