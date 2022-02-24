import { BehaviorSubject } from 'rxjs';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import {BackTestDto} from "@cta/shared/dtos";
import { BackTestsService } from '../../back-tests.service';

@Component({
  selector: 'cta-web-agents-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class ListComponent implements OnInit {
  backTests$ = new BehaviorSubject<Partial<BackTestDto[]>>([]);
  loading$ = new BehaviorSubject<boolean>(true);
  total = 1;
  limit = 10;
  page = 1;
  sortBy = '';

  constructor(private readonly backTestsService: BackTestsService) { }

  async ngOnInit(): Promise<void> {
    await this.updateAgents();
  }

  async updateAgents(): Promise<void> {
    this.loading$.next(true);
    this.backTests$.next((await this.backTestsService.get(this.limit, this.page, this.sortBy)).data);
    this.loading$.next(false);
  }

  async handleStartClick(agent: BackTestDto): Promise<void> {
    await this.backTestsService.start(agent.id as string);
  }

  async handleStopClick(agent: BackTestDto): Promise<void> {
    await this.backTestsService.stop(agent.id as string);
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
