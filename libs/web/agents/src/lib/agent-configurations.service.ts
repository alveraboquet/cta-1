import { Injectable } from '@angular/core';
import { AgentConfigurationDto } from '@cta/shared/dtos';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AgentConfigurationsService {
  private readonly apiPath = '/api/agents/configuration';

  constructor(private readonly http: HttpClient) {}

  get(agentId: string): Promise<AgentConfigurationDto> {
    return firstValueFrom(
      this.http.get<AgentConfigurationDto>(`${this.apiPath}/${agentId}`)
    );
  }

  update(
    agentId: string,
    agentConfiguration: Partial<AgentConfigurationDto>
  ): Promise<AgentConfigurationDto> {
    return firstValueFrom(
      this.http.post<AgentConfigurationDto>(
        `${this.apiPath}/${agentId}`,
        agentConfiguration
      )
    );
  }
}
