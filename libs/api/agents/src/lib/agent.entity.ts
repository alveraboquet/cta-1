import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany
} from 'typeorm';
import { AgentDto } from '@cta/shared/dtos';
import { CtaEntity } from '@cta/api/shared/entities';
import { AgentConfigurationEntity } from './agent-configurations/agent-configuration.entity';

@Entity({ name: 'agent' })
export class AgentEntity extends CtaEntity<Partial<AgentDto>> {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(
    () => AgentConfigurationEntity,
    (agentConfiguration) => agentConfiguration.agent
  )
  configurations: AgentConfigurationEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column()
  userId: string;

  constructor(agentDto?: Partial<AgentDto>) {
    super(agentDto);
  }
}
