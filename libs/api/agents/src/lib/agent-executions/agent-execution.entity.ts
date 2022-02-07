import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { AgentExecutionDto, AgentExecutionResult } from '@cta/shared/dtos';
import { CtaEntity } from '@cta/api/shared/entities';
// noinspection ES6PreferShortImport
import {AgentConfigurationEntity} from "./../agent-configurations/agent-configuration.entity";

@Entity({ name: 'agentExecution' })
export class AgentExecutionEntity extends CtaEntity<
  Partial<AgentExecutionDto>
> {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'simple-json', nullable: true })
  result: AgentExecutionResult;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(
    () => AgentConfigurationEntity,
    (configuration) => configuration.executions
  )
  agentConfiguration: AgentConfigurationEntity;

  constructor(agentExecutionDto?: Partial<AgentExecutionDto>) {
    super(agentExecutionDto);
  }
}
