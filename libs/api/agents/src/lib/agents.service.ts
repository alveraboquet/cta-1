import { Injectable } from '@nestjs/common';
import { Repository, ObjectLiteral } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AgentEntity } from './agent.entity';
import { FilterOperator, paginate, Paginated, PaginateQuery } from 'nestjs-paginate';

@Injectable()
export class AgentsService {
  constructor(
    @InjectRepository(AgentEntity)
    private readonly agentsRepository: Repository<AgentEntity>,
  ) {}

  save(agent: AgentEntity): Promise<AgentEntity> {
    return this.agentsRepository.save(agent);
  }

  find(query: PaginateQuery, userId?: string): Promise<Paginated<AgentEntity>> {
    const where = {} as ObjectLiteral;
    if (userId) where.userId = userId;

    return paginate(query, this.agentsRepository, {
      sortableColumns: ['name', 'createdAt', 'updatedAt'],
      searchableColumns: ['name'],
      defaultSortBy: [['createdAt', 'DESC']],
      filterableColumns: {
        name: [FilterOperator.EQ, FilterOperator.IN],
        createdAt: [FilterOperator.GTE, FilterOperator.LTE],
        updatedAt: [FilterOperator.GTE, FilterOperator.LTE],
      },
      where
    });
  }

  findOne(id: string, userId?: string): Promise<AgentEntity> {
    const where = {} as ObjectLiteral;
    if (userId) where.userId = userId;
    return this.agentsRepository.findOne(id, { where });
  }

  delete(id: string, userId?: string): Promise<AgentEntity> {
    return this.agentsRepository.softRemove({ id, userId });
  }
}
