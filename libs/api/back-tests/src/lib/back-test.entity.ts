import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { CtaEntity } from '@cta/api/shared/entities';
import { BackTestDto } from '@cta/shared/dtos';
import { BackTestConfigurationEntity } from './back-test-configurations/back-test-configuration.entity';

@Entity({ name: 'backTest' })
export class BackTestEntity extends CtaEntity<Partial<BackTestDto>> {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(
    () => BackTestConfigurationEntity,
    (backTestConfiguration) => backTestConfiguration.backTest
  )
  configurations: BackTestConfigurationEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column()
  userId: string;

  constructor(backTestDto?: Partial<BackTestDto>) {
    super(backTestDto);
  }
}
