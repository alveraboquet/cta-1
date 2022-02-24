import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { BackTestsRoutingModule } from './back-tests.routing.module';
import { ListComponent } from './components/list/list.component';
import { DetailComponent } from './components/detail/detail.component';
import { BackTestsService } from './back-tests.service';
import {AgentsModule} from "@cta/web/agents";

@NgModule({
  imports: [
    CommonModule,
    BackTestsRoutingModule,
    AgentsModule,
    ReactiveFormsModule,
    NzTableModule,
    NzDividerModule,
    NzPageHeaderModule,
    NzButtonModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzTypographyModule,
    NzSpinModule,
    NzMessageModule,
  ],
  declarations: [ListComponent, DetailComponent],
  providers: [BackTestsService],
})
export class WebBackTestsModule {}
