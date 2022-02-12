import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AgentsService } from '../../agents.service';
import { BehaviorSubject } from 'rxjs';
import { AgentDto } from '@cta/shared/dtos';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

@Component({
  selector: 'cta-web-agents-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class ListComponent implements OnInit {
  agents$ = new BehaviorSubject<Partial<AgentDto[]>>([]);
  loading$ = new BehaviorSubject<boolean>(true);
  total = 1;
  limit = 10;
  page = 1;
  sortBy = '';

  constructor(private readonly agentsService: AgentsService) { }

  async ngOnInit(): Promise<void> {
    await this.updateAgents();
  }

  async updateAgents(): Promise<void> {
    this.loading$.next(true);
    this.agents$.next((await this.agentsService.get(this.limit, this.page, this.sortBy)).data);
    this.loading$.next(false);
  }

  async handleStartClick(agent: AgentDto): Promise<void> {
    await this.agentsService.start(agent.id as string);
  }

  async handleStopClick(agent: AgentDto): Promise<void> {
    await this.agentsService.stop(agent.id as string);
  }

  async handleQueryParamsChange(event: NzTableQueryParams): Promise<void> {
    this.limit = event.pageSize;
    this.page = event.pageIndex;
    for (const sortItem of event.sort) {
      if (sortItem.value) {
        this.sortBy += `${sortItem.key}:${sortItem.value?.toUpperCase()}`
      }

      if (sortItem !== event.sort[-1]) {
        this.sortBy += ','
      }
    }
    await this.updateAgents();
  }


}
