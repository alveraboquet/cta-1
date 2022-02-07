import {
  OnQueueActive,
  OnQueueCompleted,
  Process,
  Processor,
} from '@nestjs/bull';
import { Job, JobId } from 'bull';
import { Logger } from '@nestjs/common';
import { AgentExecutionEntity } from './agent-execution.entity';
import { AgentExecutionsService } from './agent-executions.service';
import { AgentConfigurationsService } from '../agent-configurations/agent-configurations.service';
import { ExchangesService } from '@cta/api/exchanges';
import { JobData } from './job-data';
import { environment } from '@cta/api/env';

@Processor('agents-executions')
export class AgentsExecutionsConsumer {
  jobExecutions = new Map<JobId, AgentExecutionEntity>();

  constructor(
    private readonly logger: Logger,
    private readonly agentExecutionsService: AgentExecutionsService,
    private readonly agentConfigurationService: AgentConfigurationsService,
    private readonly exchangesService: ExchangesService
  ) {}

  @Process()
  async run(job: Job<JobData>): Promise<AgentExecutionEntity['result']> {
    let execution = new AgentExecutionEntity();
    execution.agentConfiguration =
      await this.agentConfigurationService.findLatest(job.data.agent.id);
    await this.agentExecutionsService.save(execution);
    this.jobExecutions.set(job.id, execution);

    return await this.agentExecutionsService.execute(job.data.agent, execution.agentConfiguration);
  }

  @OnQueueActive()
  async onActive(job: Job<JobData>): Promise<void> {
    this.logger.log(
      `Started agent execution job ${job.id} with data ${JSON.stringify(
        job.data
      )}...`
    );
  }

  @OnQueueCompleted()
  async onCompleted(job: Job<JobData>): Promise<void> {
    this.logger.log(
      `Ended agent execution job:${job.id} with return value: ${JSON.stringify(job.returnvalue)}`
    );

    const execution = this.jobExecutions.get(job.id);
    this.jobExecutions.delete(job.id);

    await this.agentExecutionsService.save({
      ...execution,
      result: job.returnvalue,
    });

    let orderResult;
    if (environment.production && job.returnvalue && job.returnvalue.side && job.returnvalue.type) {
      const connector = await this.exchangesService.getConnector(job.data.agent.userId, execution.agentConfiguration.exchangeType);

      try {
        orderResult = await connector.createOrder(job.returnvalue);
      } catch (e) {
        this.logger.error({ error: e, data: e.response?.data });
      }
    }

    this.logger.log(
      `job:${job.id} order execution completed: ${JSON.stringify(orderResult?.data)}`
    );
  }
}
