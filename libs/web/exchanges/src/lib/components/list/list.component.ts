import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ExchangeDto } from '@cta/shared/dtos';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ExchangesService } from '../../exchanges.service';

@Component({
  selector: 'cta-web-exchanges-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class ListComponent implements OnInit {
  exchanges$ = new BehaviorSubject<Partial<ExchangeDto[]>>([]);
  loading$ = new BehaviorSubject<boolean>(true);
  total = 1;
  limit = 10;
  page = 1;
  sortBy = '';

  constructor(private readonly exchangesService: ExchangesService) {}

  async ngOnInit(): Promise<void> {
    await this.updateExchanges();
  }

  async updateExchanges(): Promise<void> {
    this.loading$.next(true);
    this.exchanges$.next(
      (await this.exchangesService.get(this.limit, this.page, this.sortBy)).data
    );
    this.loading$.next(false);
  }

  async handleQueryParamsChange(event: NzTableQueryParams): Promise<void> {
    this.limit = event.pageSize;
    this.page = event.pageIndex;
    for (const sortItem of event.sort) {
      if (sortItem.value) {
        this.sortBy += `${sortItem.key}:${sortItem.value?.toUpperCase()}`;
      }

      if (sortItem !== event.sort[-1]) {
        this.sortBy += ',';
      }
    }
    await this.updateExchanges();
  }
}
