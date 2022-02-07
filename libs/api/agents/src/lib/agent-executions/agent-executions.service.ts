import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AgentConfig, AgentExecutionResult,
  AgentModeType,
  AgentType
} from '@cta/shared/dtos';
import { HttpService } from '@nestjs/axios';
import { InjectQueue } from '@nestjs/bull';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Repository } from 'typeorm';
import { Job, Queue } from 'bull';
import { CronJob } from 'cron';
import { EnginesService } from '@cta/api/engines';
// noinspection ES6PreferShortImport
import { AgentConfigurationEntity } from '../agent-configurations/agent-configuration.entity';
// noinspection ES6PreferShortImport
import { AgentConfigurationsService } from '../agent-configurations/agent-configurations.service';
import { AgentEntity } from '../agent.entity';
import { AgentExecutionEntity } from './agent-execution.entity';
import { JobData } from './job-data';
import { ExecutionEngine } from '@cta/api/engines';
import { DataEngine } from '@cta/api/engines';

@Injectable()
export class AgentExecutionsService {
  engines = new Map<string, ExecutionEngine<DataEngine, AgentConfig>>();

  constructor(
    @InjectRepository(AgentExecutionEntity)
    private readonly agentExecutionsRepository: Repository<AgentExecutionEntity>,
    @InjectQueue('agents-executions')
    private readonly agentsExecutionsQueue: Queue<JobData>,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly agentConfigurationsService: AgentConfigurationsService,
    private readonly httpService: HttpService,
    private readonly logger: Logger,
    private readonly enginesService: EnginesService
  ) {}

  async save(
    agentExecution: AgentExecutionEntity
  ): Promise<AgentExecutionEntity> {
    return await this.agentExecutionsRepository.save(agentExecution);
  }

  async execute(
    agent: AgentEntity,
    agentConfiguration: AgentConfigurationEntity
  ): Promise<AgentExecutionResult> {
    let engine = this.engines.get(agent.id);

    if (!engine) {
      engine = await this.enginesService.getAgentEngine(agent.userId, agentConfiguration);
      this.engines.set(agent.id, engine);
    }

    return await engine.execute();
  }

  addToExecutionQueue(agent: AgentEntity): Promise<Job<JobData>> {
    return this.agentsExecutionsQueue.add({ agent });
  }

  async start(agent: AgentEntity): Promise<void> {
    const latestConfiguration =
        await this.agentConfigurationsService.findLatest(agent.id),
      executionHandler = this.getExecutionHandler(agent);

    await executionHandler();

    let timeout, interval, job;
    switch (latestConfiguration.mode.type) {
      case AgentModeType.TIMEOUT:
        timeout = setTimeout(
          executionHandler,
          parseInt(latestConfiguration.mode.value)
        );
        this.schedulerRegistry.addTimeout(agent.name, timeout);
        break;
      case AgentModeType.INTERVAL:
        interval = setInterval(
          executionHandler,
          parseInt(latestConfiguration.mode.value)
        );
        this.schedulerRegistry.addInterval(agent.name, interval);
        break;
      case AgentModeType.CRON:
        job = new CronJob(
          latestConfiguration.mode.value,
          executionHandler
        );
        this.schedulerRegistry.addCronJob(agent.name, job);
        job.start();
        break;
    }
  }

  async stop(agent: AgentEntity): Promise<void> {
    const latestConfiguration =
      await this.agentConfigurationsService.findLatest(agent.id);

    switch (latestConfiguration.mode.type) {
      case AgentModeType.TIMEOUT:
        this.schedulerRegistry.deleteTimeout(agent.name);
        break;
      case AgentModeType.INTERVAL:
        this.schedulerRegistry.deleteInterval(agent.name);
        break;
      case AgentModeType.CRON:
        this.schedulerRegistry.deleteCronJob(agent.name);
        break;
    }

    if (latestConfiguration.type === AgentType.GRID) {
      this.engines.delete(agent.id);
    }

    this.logger.log(`Agent "${agent.name}" deleted!`);
  }

  private getExecutionHandler(agent: AgentEntity): () => Promise<void> {
    return async () => {
      this.logger.log(`Agent ${agent.name}:${agent.id} executing!`);
      await this.addToExecutionQueue(agent);
    };
  }
}
