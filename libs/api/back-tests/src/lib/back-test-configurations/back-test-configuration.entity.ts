import {
  Column,
  CreateDateColumn,
  Entity,
  Index, JoinTable, ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import { BackTestConfigurationDto } from '@cta/shared/dtos';
import { CtaEntity } from '@cta/api/shared/entities';
import { AgentEntity } from '@cta/api/agents';
import { BackTestEntity } from '../back-test.entity';
import { BackTestExecutionEntity } from '../back-test-executions/back-test-execution.entity';

@Entity({ name: 'backTestConfiguration' })
@Index(["version", "backTest"], { unique: true })
export class BackTestConfigurationEntity extends CtaEntity<Partial<BackTestConfigurationDto>> {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => AgentEntity, { eager: true })
  @JoinTable()
  agents: AgentEntity[];

  startDate: Date;

  endDate: Date;

  @Column()
  version: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => BackTestEntity, (backTest) => backTest.configurations)
  backTest: BackTestEntity;

  @OneToMany(
    () => BackTestExecutionEntity,
    (backTestExecution) => backTestExecution.backTestConfiguration
  )
  executions: BackTestExecutionEntity[];

  constructor(backTestConfigurationDto?: Partial<BackTestConfigurationDto>) {
    super(backTestConfigurationDto);
  }
}
