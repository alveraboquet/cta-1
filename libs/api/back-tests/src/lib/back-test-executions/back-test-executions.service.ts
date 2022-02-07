import { Queue } from 'bull';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectQueue } from '@nestjs/bull';
import { AgentConfigurationsService } from '@cta/api/agents';
import { DataEngine, EnginesService, ExecutionEngine } from '@cta/api/engines';
import { AgentConfig } from '@cta/shared/dtos';
import { BackTestExecutionResult } from '@cta/shared/dtos';
import { BackTestEntity } from '../back-test.entity';
import { BackTestConfigurationEntity } from '../back-test-configurations/back-test-configuration.entity';
import { JobData } from './job-data';
import { BackTestExecutionEntity } from './back-test-execution.entity';

@Injectable()
export class BackTestExecutionsService {
  engines = new Map<string, ExecutionEngine<DataEngine, AgentConfig>>();

  constructor(
    @InjectRepository(BackTestExecutionEntity)
    private readonly backTestExecutionsRepository: Repository<BackTestExecutionEntity>,
    @InjectQueue('back-tests-executions')
    private readonly backTestsExecutionsQueue: Queue<JobData>,
    private readonly enginesService: EnginesService,
    private readonly agentConfigurationsService: AgentConfigurationsService,
  ) {}

  async save(
    backTestExecution: BackTestExecutionEntity
  ): Promise<BackTestExecutionEntity> {
    return await this.backTestExecutionsRepository.save(backTestExecution);
  }

  async execute(
    backTest: BackTestEntity,
    backTestConfiguration: BackTestConfigurationEntity
  ): Promise<BackTestExecutionResult> {
    let result = {};

    for (const agent of backTestConfiguration.agents) {
      const agentResults = {};
      const agentConfiguration = await this.agentConfigurationsService.findLatest(agent.id);
      const engine = await this.enginesService.getBackTestEngine(
        agent.userId,
        agentConfiguration
      );

      const from = new Date();
      from.setMilliseconds(0);
      from.setSeconds(0);
      const to = new Date(from);
      to.setDate(to.getDate() - 1);

      await engine.dataEngine.initData(['BNBUSDT'], to, from);

      for (const current = new Date(from); to <= current; current.setMinutes(current.getMinutes() - 1)) {
        engine.dataEngine.currentDate = current;
        agentResults[current.getTime()] = await engine.execute();
      }
      result[agent.id] = agentResults;
    }

    return result;
  }

  async run(backTest: BackTestEntity): Promise<void> {
    await this.backTestsExecutionsQueue.add({ backTest });
  }
}
