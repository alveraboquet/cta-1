import { ObjectLiteral, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BackTestEntity } from './back-test.entity';
import { FilterOperator, paginate, Paginated, PaginateQuery } from 'nestjs-paginate';

@Injectable()
export class BackTestsService {
  constructor(
    @InjectRepository(BackTestEntity)
    private readonly backTestsRepository: Repository<BackTestEntity>,
  ) {}

  save(backTest: BackTestEntity): Promise<BackTestEntity> {
    return this.backTestsRepository.save(backTest);
  }

  find(query: PaginateQuery, userId?: string): Promise<Paginated<BackTestEntity>> {
    const where = {} as ObjectLiteral;
    if (userId) where.userId = userId;

    return paginate(query, this.backTestsRepository, {
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

  findOne(id: string, userId?: string): Promise<BackTestEntity> {
    const where = {} as ObjectLiteral;
    if (userId) where.userId = userId;
    return this.backTestsRepository.findOne(id, { where });
  }

  delete(id: string, userId?: string): Promise<BackTestEntity> {
    return this.backTestsRepository.softRemove({ id, userId });
  }
}
