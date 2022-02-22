import { Injectable } from '@angular/core';
import { AgentDto } from '@cta/shared/dtos';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Paginated } from 'nestjs-paginate';

@Injectable()
export class AgentsService {
  private readonly apiPath = '/api/agents';

  constructor(private readonly http: HttpClient) {}

  get(limit: number, page = 0, sortBy = ''): Promise<Paginated<AgentDto>> {
    return firstValueFrom(
      this.http.get<Paginated<AgentDto>>(this.apiPath, {
        params: { limit, page, sortBy },
      })
    );
  }

  findOne(id: string): Promise<AgentDto> {
    return firstValueFrom(
      this.http.get<AgentDto>(`${this.apiPath}/${id}`)
    );
  }

  update(agent: Partial<AgentDto>): Promise<AgentDto> {
    return firstValueFrom(
      this.http.post<AgentDto>(this.apiPath, agent)
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
