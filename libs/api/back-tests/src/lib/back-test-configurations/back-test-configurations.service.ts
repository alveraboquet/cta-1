import { Injectable } from '@nestjs/common';
import { Repository, ObjectLiteral } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BackTestConfigurationEntity } from './back-test-configuration.entity';

@Injectable()
export class BackTestConfigurationsService {
  constructor(
    @InjectRepository(BackTestConfigurationEntity)
    private readonly backTestConfigurationsRepository: Repository<BackTestConfigurationEntity>
  ) {}

  async save(
    backTestConfiguration: BackTestConfigurationEntity
  ): Promise<BackTestConfigurationEntity> {
    const latest = await this.findLatest(backTestConfiguration.backTest.id);
    backTestConfiguration.version = latest ? latest.version + 1 : 1;
    return await this.backTestConfigurationsRepository.save(backTestConfiguration);
  }

  findAll(backTestId: string): Promise<BackTestConfigurationEntity[]> {
    const where = { backTest: { id: backTestId } } as ObjectLiteral;
    return this.backTestConfigurationsRepository.find({ where });
  }

  async findLatest(
    backTestId: string
  ): Promise<BackTestConfigurationEntity | undefined> {
    const configurations = await this.findAll(backTestId);
    return configurations.reduce(
      (prev, current) => (prev.version > current.version ? prev : current),
      { version: 0 } as unknown as BackTestConfigurationEntity
    );
  }
}
