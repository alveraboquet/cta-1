import { Injectable } from '@angular/core';
import {BackTestDto} from '@cta/shared/dtos';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Paginated } from 'nestjs-paginate';

@Injectable()
export class BackTestsService {
  private readonly apiPath = '/api/back-tests';

  constructor(private readonly http: HttpClient) {}

  get(limit: number, page = 0, sortBy = ''): Promise<Paginated<BackTestDto>> {
    return firstValueFrom(
      this.http.get<Paginated<BackTestDto>>(this.apiPath, {
        params: { limit, page, sortBy },
      })
    );
  }

  findOne(id: string): Promise<BackTestDto> {
    return firstValueFrom(
      this.http.get<BackTestDto>(`${this.apiPath}/${id}`)
    );
  }

  update(agent: Partial<BackTestDto>): Promise<BackTestDto> {
    return firstValueFrom(
      this.http.post<BackTestDto>(this.apiPath, agent)
    );
  }

  start(agentId: string): Promise<any> {
    return firstValueFrom(
      this.http.post(this.apiPath + '/start/' + agentId, null)
    );
  }

  stop(agentId: string): Promise<any> {
    return firstValueFrom(
      this.http.post(this.apiPath + '/stop/' + agentId, null)
    );
  }
}
