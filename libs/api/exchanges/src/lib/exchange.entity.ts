import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn, Index
} from 'typeorm';
import { CtaEntity } from '@cta/api/shared/entities';
import { ExchangeConfig, ExchangeDto, ExchangeType } from '@cta/shared/dtos';

@Entity({ name: 'exchange' })
@Index(["type", "userId"], { unique: true })
export class ExchangeEntity extends CtaEntity<Partial<ExchangeDto>> {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: "enum",
    enum: ExchangeType
  })
  type: ExchangeType;

  @Column('simple-json')
  config: ExchangeConfig;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column()
  userId: string;

  constructor(agentDto?: Partial<ExchangeDto>) {
    super(agentDto);
  }
}
