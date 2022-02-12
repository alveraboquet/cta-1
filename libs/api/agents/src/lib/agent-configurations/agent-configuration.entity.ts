import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import { CtaEntity } from '@cta/api/shared/entities';
import { AgentConfig, AgentConfigurationDto, AgentMode, AgentType } from '@cta/shared/dtos';
import { ExchangeType } from '@cta/shared/dtos';
import { AgentEntity } from '../agent.entity';
import { AgentExecutionEntity } from '../agent-executions/agent-execution.entity';

@Entity({ name: 'agentConfiguration' })
@Index(["version", "agent"], { unique: true })
export class AgentConfigurationEntity extends CtaEntity<Partial<AgentConfigurationDto>> {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: "enum",
    enum: ExchangeType
  })
  exchangeType: ExchangeType;

  @Column('simple-json')
  mode: AgentMode;

  @Column({
    type: "enum",
    enum: AgentType
  })
  type: AgentType;

  @Column('simple-json')
  config: AgentConfig;

  @Column()
  version: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => AgentEntity, (agent) => agent.configurations)
  agent: AgentEntity;

  @OneToMany(
    () => AgentExecutionEntity,
    (agentExecution) => agentExecution.agentConfiguration
  )
  executions: AgentExecutionEntity[];

  constructor(agentConfigurationDto?: Partial<AgentConfigurationDto>) {
    super(agentConfigurationDto);
  }
}
