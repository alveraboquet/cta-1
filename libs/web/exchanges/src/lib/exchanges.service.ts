import { Injectable } from '@angular/core';
import {AgentDto, ExchangeDto, ExchangeType} from '@cta/shared/dtos';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Paginated } from 'nestjs-paginate';

@Injectable()
export class ExchangesService {
  private readonly apiPath = '/api/exchanges';

  constructor(private readonly http: HttpClient) {}

  get(limit: number, page = 0, sortBy = ''): Promise<Paginated<ExchangeDto>> {
    return firstValueFrom(
      this.http.get<Paginated<ExchangeDto>>(this.apiPath, {
        params: { limit, page, sortBy },
      })
    );
  }

  findOne(idOrType: string | ExchangeType): Promise<ExchangeDto> {
    return firstValueFrom(
      this.http.get<ExchangeDto>(`${this.apiPath}/${idOrType}`)
    );
  }

  update(agent: Partial<ExchangeDto>): Promise<ExchangeDto> {
    return firstValueFrom(
      this.http.post<ExchangeDto>(this.apiPath, agent)
    );
  }
}
