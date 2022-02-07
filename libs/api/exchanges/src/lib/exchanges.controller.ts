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
import { ExchangeDto } from '@cta/shared/dtos';
// noinspection ES6PreferShortImport
import { ExchangesService } from './exchanges.service';
import { ExchangeEntity } from './exchange.entity';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';

@Controller('exchanges')
export class ExchangesController {
  constructor(private readonly exchangesService: ExchangesService) {}

  @UseGuards(AuthGuard('firebase-jwt'))
  @Post()
  create(@User() user: auth.DecodedIdToken, @Body() exchangeDto: ExchangeDto) {
    let result;
    const exchange = new ExchangeEntity(exchangeDto);

    if (!exchange.userId) {
      exchange.userId = user.uid;
    }
    if (exchange.userId === user.uid) {
      result = this.exchangesService.save(exchange);
    }

    return result;
  }

  @UseGuards(AuthGuard('firebase-jwt'))
  @Get()
  find(
    @User() user: auth.DecodedIdToken,
    @Paginate() query: PaginateQuery
  ): Promise<Paginated<ExchangeEntity>> {
    return this.exchangesService.find(query, user.uid);
  }

  @UseGuards(AuthGuard('firebase-jwt'))
  @Delete('/:id')
  delete(@User() user: auth.DecodedIdToken, @Param('id') id: string) {
    return this.exchangesService.delete(id, user.uid);
  }
}
