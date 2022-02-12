import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AgentsRoutingModule } from './agents.routing.module';
import { AgentsService } from './agents.service';
import { AgentConfigurationsService } from './agent-configurations.service';
import { ListComponent } from './components/list/list.component';
import { EditComponent } from './components/edit/edit.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import {NzSpinModule} from "ng-zorro-antd/spin";

@NgModule({
  imports: [
    CommonModule,
    AgentsRoutingModule,
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
  ],
  declarations: [ListComponent, EditComponent],
  providers: [AgentsService, AgentConfigurationsService],
})
export class AgentsModule {}