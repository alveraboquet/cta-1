import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { auth } from 'firebase-admin';
import { AgentConfigurationDto, AgentDto } from '@cta/shared/dtos';
import { User } from '@cta/api/auth';
// noinspection ES6PreferShortImport
import { AgentsService } from './agents.service';
import { AgentEntity } from './agent.entity';
import { AgentExecutionsService } from './agent-executions/agent-executions.service';
import { AgentConfigurationsService } from './agent-configurations/agent-configurations.service';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { AgentConfigurationEntity } from '@cta/api/agents';

@Controller('agents')
export class AgentsController {
  constructor(
    private readonly agentsService: AgentsService,
    private readonly agentConfigurationsService: AgentConfigurationsService,
    private readonly agentExecutionService: AgentExecutionsService
  ) {}

  @UseGuards(AuthGuard('firebase-jwt'))
  @Post()
  async create(
    @User() user: auth.DecodedIdToken,
    @Body() agentDto: Partial<AgentDto>
  ): Promise<AgentDto> {
    let result: AgentDto;

    const agent = new AgentEntity(agentDto);

    if (!agent.userId) {
      agent.userId = user.uid;
    }
    if (agent.userId === user.uid) {
      result = (await this.agentsService.save(agent)) as unknown as AgentDto;
    }

    if (agentDto.configuration) {
      agentDto.configuration.agent = { id: result.id };
      const configuration = new AgentConfigurationEntity(agentDto.configuration);
      result.configuration = (await this.agentConfigurationsService.save(
        configuration
      )) as unknown as AgentConfigurationDto;
    }

    return result;
  }

  @UseGuards(AuthGuard('firebase-jwt'))
  @Get()
  async find(
    @User() user: auth.DecodedIdToken,
    @Paginate() query: PaginateQuery
  ): Promise<Paginated<AgentEntity>> {
    return await this.agentsService.find(query, user.uid);
  }

  @UseGuards(AuthGuard('firebase-jwt'))
  @Get(':id')
  async findOne(
    @User() user: auth.DecodedIdToken,
    @Param('id') id: string
  ): Promise<AgentDto> {
    let result: AgentDto;

    result = (await this.agentsService.findOne(
      id,
      user.id
    )) as unknown as AgentDto;

    result.configuration = (await this.agentConfigurationsService.findLatest(
      id
    )) as unknown as AgentConfigurationDto;

    return result;
  }

  @UseGuards(AuthGuard('firebase-jwt'))
  @Delete('/:id')
  async delete(
    @User() user: auth.DecodedIdToken,
    @Param('id') id: string
  ): Promise<AgentEntity> {
    return await this.agentsService.delete(id, user.uid);
  }

  @UseGuards(AuthGuard('firebase-jwt'))
  @Post('/start/:id')
  async start(
    @User() user: auth.DecodedIdToken,
    @Param('id') id: string
  ): Promise<void> {
    const agent = await this.agentsService.findOne(id, user.id);
    await this.agentExecutionService.start(agent);
  }

  @UseGuards(AuthGuard('firebase-jwt'))
  @Post('/stop/:id')
  async stop(
    @User() user: auth.DecodedIdToken,
    @Param('id') id: string
  ): Promise<void> {
    const agent = await this.agentsService.findOne(id, user.id);
    await this.agentExecutionService.stop(agent);
  }
}
