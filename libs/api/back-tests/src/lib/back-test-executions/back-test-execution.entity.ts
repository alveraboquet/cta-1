import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { BackTestExecutionDto, BackTestExecutionResult } from '@cta/shared/dtos';
import { CtaEntity } from '@cta/api/shared/entities';
import { BackTestConfigurationEntity } from '../back-test-configurations/back-test-configuration.entity';

@Entity({ name: 'backTestExecution' })
export class BackTestExecutionEntity extends CtaEntity<
  Partial<BackTestExecutionDto>
> {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'simple-json', nullable: true })
  result: BackTestExecutionResult;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(
    () => BackTestConfigurationEntity,
    (configuration) => configuration.executions
  )
  backTestConfiguration: BackTestConfigurationEntity;

  constructor(backTestExecutionDto?: Partial<BackTestExecutionDto>) {
    super(backTestExecutionDto);
  }
}
