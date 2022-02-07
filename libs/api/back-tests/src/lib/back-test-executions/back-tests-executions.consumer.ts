import {
  OnQueueActive,
  OnQueueCompleted,
  Process,
  Processor,
} from '@nestjs/bull';
import { Job, JobId } from 'bull';
import { Logger } from '@nestjs/common';
import { BackTestExecutionEntity } from './back-test-execution.entity';
import { BackTestExecutionsService } from './back-test-executions.service';
import { BackTestConfigurationsService } from '../back-test-configurations/back-test-configurations.service';
import { JobData } from './job-data';

@Processor('back-tests-executions')
export class BackTestsExecutionsConsumer {
  jobExecutions = new Map<JobId, BackTestExecutionEntity>();

  constructor(
    private readonly logger: Logger,
    private readonly backTestExecutionsService: BackTestExecutionsService,
    private readonly backTestConfigurationService: BackTestConfigurationsService
  ) {}

  @Process()
  async run(job: Job<JobData>): Promise<BackTestExecutionEntity['result']> {
    let execution = new BackTestExecutionEntity();
    execution.backTestConfiguration =
      await this.backTestConfigurationService.findLatest(job.data.backTest.id);
    await this.backTestExecutionsService.save(execution);
    this.jobExecutions.set(job.id, execution);

    return await this.backTestExecutionsService.execute(job.data.backTest, execution.backTestConfiguration);
  }

  @OnQueueActive()
  async onActive(job: Job<JobData>): Promise<void> {
    this.logger.log(
      `Started backTest execution job ${job.id} with data ${JSON.stringify(
        job.data
      )}...`
    );
  }

  @OnQueueCompleted()
  async onCompleted(job: Job<JobData>): Promise<void> {
    this.logger.log(
      `Ended backTest execution job:${job.id} with return value: ${JSON.stringify(job.returnvalue)}`
    );

    const execution = this.jobExecutions.get(job.id);
    this.jobExecutions.delete(job.id);

    await this.backTestExecutionsService.save({
      ...execution,
      result: job.returnvalue,
    });
  }
}
