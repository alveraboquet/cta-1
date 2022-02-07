import { Injectable } from '@nestjs/common';
import { Repository, ObjectLiteral } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ExchangeEntity } from './exchange.entity';
import { ExchangeType } from '@cta/shared/dtos';
import { ExchangeConnectorsService } from './exchange-connectors/exchange-connectors.service';
import { ExchangeConnector } from './exchange-connectors/exchange-connector';
import { FilterOperator, paginate, Paginated, PaginateQuery } from 'nestjs-paginate';

@Injectable()
export class ExchangesService {
  constructor(
    @InjectRepository(ExchangeEntity)
    private readonly exchangesRepository: Repository<ExchangeEntity>,
    private readonly exchangeConnectorsService: ExchangeConnectorsService
  ) {}

  save(exchange: ExchangeEntity): Promise<ExchangeEntity> {
    return this.exchangesRepository.save(exchange);
  }

  findAll(userId?: string): Promise<ExchangeEntity[]> {
    const where = {} as ObjectLiteral;
    if (userId) where.userId = userId;
    return this.exchangesRepository.find({ where });
  }

  find(query: PaginateQuery, userId?: string): Promise<Paginated<ExchangeEntity>> {
    const where = {} as ObjectLiteral;
    if (userId) where.userId = userId;

    return paginate(query, this.exchangesRepository, {
      sortableColumns: ['type', 'createdAt', 'updatedAt'],
      searchableColumns: ['type'],
      defaultSortBy: [['createdAt', 'DESC']],
      filterableColumns: {
        type: [FilterOperator.EQ, FilterOperator.IN],
        createdAt: [FilterOperator.GTE, FilterOperator.LTE],
        updatedAt: [FilterOperator.GTE, FilterOperator.LTE],
      },
      where
    });
  }


  findOne(userId: string, type: ExchangeType): Promise<ExchangeEntity | undefined> {
    const where = {
      userId,
      type,
    } as ObjectLiteral;
    return this.exchangesRepository.findOne({ where });
  }

  delete(id: string, userId?: string): Promise<ExchangeEntity> {
    return this.exchangesRepository.softRemove({ id, userId });
  }

  async getConnector(userId: string, type: ExchangeType): Promise<ExchangeConnector> {
    const exchange = await this.findOne(userId, type);
    if (!exchange) {
      throw new Error(`No ${type} exchange found.`);
    }
    return await this.exchangeConnectorsService.get(exchange);
  }
}
