import { Injectable } from '@nestjs/common';
import { Repository, ObjectLiteral } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AgentConfigurationEntity } from './agent-configuration.entity';

@Injectable()
export class AgentConfigurationsService {
  constructor(
    @InjectRepository(AgentConfigurationEntity)
    private readonly agentConfigurationsRepository: Repository<AgentConfigurationEntity>
  ) {}

  async save(
    agentConfiguration: AgentConfigurationEntity
  ): Promise<AgentConfigurationEntity> {
    const latest = await this.findLatest(agentConfiguration.agent.id);
    agentConfiguration.version = latest ? latest.version + 1 : 1;
    return await this.agentConfigurationsRepository.save(agentConfiguration);
  }

  findAll(agentId: string): Promise<AgentConfigurationEntity[]> {
    const where = { agent: { id: agentId } } as ObjectLiteral;
    return this.agentConfigurationsRepository.find({ where });
  }

  async findLatest(
    agentId: string
  ): Promise<AgentConfigurationEntity | undefined> {
    const configurations = await this.findAll(agentId);
    return configurations.reduce(
      (prev, current) => (prev.version > current.version ? prev : current),
      { version: 0 } as unknown as AgentConfigurationEntity
    );
  }
}
