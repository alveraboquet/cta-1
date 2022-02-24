import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExchangesRoutingModule } from './exchanges.routing.module';
import { ListComponent } from './components/list/list.component';
import { DetailComponent } from './components/detail/detail.component';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { ExchangesService } from './exchanges.service';
import { NzMessageModule } from 'ng-zorro-antd/message';

@NgModule({
  imports: [
    CommonModule,
    ExchangesRoutingModule,
    ReactiveFormsModule,
    NzPageHeaderModule,
    NzTableModule,
    NzFormModule,
    NzSelectModule,
    NzButtonModule,
    NzSpinModule,
    NzInputModule,
    NzTypographyModule,
    NzMessageModule,
  ],
  declarations: [ListComponent, DetailComponent],
  providers: [ExchangesService],
})
export class WebExchangesModule {}
