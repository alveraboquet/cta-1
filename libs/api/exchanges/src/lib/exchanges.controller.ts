import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { auth } from 'firebase-admin';
import { User } from '@cta/api/auth';
import {
  AgentConfigurationDto,
  AgentDto,
  ExchangeDto,
  ExchangeType,
} from '@cta/shared/dtos';
// noinspection ES6PreferShortImport
import { ExchangesService } from './exchanges.service';
import { ExchangeEntity } from './exchange.entity';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';

@Controller('exchanges')
export class ExchangesController {
  constructor(private readonly exchangesService: ExchangesService) {}

  @UseGuards(AuthGuard('firebase-jwt'))
  @Post()
  async create(
    @User() user: auth.DecodedIdToken,
    @Body() exchangeDto: Partial<ExchangeDto>
  ): Promise<ExchangeDto> {
    let result;
    const exchange = new ExchangeEntity(exchangeDto);

    if (!exchange.userId) {
      exchange.userId = user.uid;
    }
    if (exchange.userId === user.uid) {
      result = await this.exchangesService.save(exchange);
    }

    return result;
  }

  @UseGuards(AuthGuard('firebase-jwt'))
  @Get()
  async find(
    @User() user: auth.DecodedIdToken,
    @Paginate() query: PaginateQuery
  ): Promise<Paginated<ExchangeDto>> {
    return (await this.exchangesService.find(
      query,
      user.uid
    )) as Paginated<unknown> as Paginated<ExchangeDto>;
  }

  @UseGuards(AuthGuard('firebase-jwt'))
  @Get(':id')
  async findOne(
    @User() user: auth.DecodedIdToken,
    @Param('idOrType') idOrType: string | ExchangeType
  ): Promise<ExchangeDto> {
    let result: ExchangeDto;

    if (
      Object.values(ExchangeType).some(
        (exchangeType) => exchangeType === idOrType
      )
    ) {
      result = (await this.exchangesService.findOne(
        user.id,
        idOrType as ExchangeType
      )) as unknown as ExchangeDto;
    } else {
      const exchange = await this.exchangesService.findOneById(
        idOrType as string
      );
      if (exchange.userId === user.uid) {
        result = exchange;
      }
    }

    return result;
  }

  @UseGuards(AuthGuard('firebase-jwt'))
  @Delete('/:id')
  delete(@User() user: auth.DecodedIdToken, @Param('id') id: string) {
    return this.exchangesService.delete(id, user.uid);
  }
}
