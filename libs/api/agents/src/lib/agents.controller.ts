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
import { AgentDto } from '@cta/shared/dtos';
import { User } from '@cta/api/auth';
// noinspection ES6PreferShortImport
import { AgentsService } from './agents.service';
import { AgentEntity } from './agent.entity';
import { AgentExecutionsService } from './agent-executions/agent-executions.service';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';

@Controller('agents')
export class AgentsController {
  constructor(
    private readonly agentsService: AgentsService,
    private readonly agentsExecutionService: AgentExecutionsService
  ) {}

  @UseGuards(AuthGuard('firebase-jwt'))
  @Post()
  async create(
    @User() user: auth.DecodedIdToken,
    @Body() agentDto: AgentDto
  ): Promise<AgentEntity> {
    let result;
    const agent = new AgentEntity(agentDto);

    if (!agent.userId) {
      agent.userId = user.uid;
    }
    if (agent.userId === user.uid) {
      result = await this.agentsService.save(agent);
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
    await this.agentsExecutionService.start(agent);
  }

  @UseGuards(AuthGuard('firebase-jwt'))
  @Post('/stop/:id')
  async stop(
    @User() user: auth.DecodedIdToken,
    @Param('id') id: string
  ): Promise<void> {
    const agent = await this.agentsService.findOne(id, user.id);
    await this.agentsExecutionService.stop(agent);
  }
}
