import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './components/list/list.component';
import { EditComponent } from './components/edit/edit.component';

const routes: Routes = [
  {
    path: '',
    component: ListComponent,
  },
  {
    path: 'edit',
    component: EditComponent,
    data: {
      breadcrumb: 'Edit'
    }
  },
  {
    path: 'edit/:id',
    component: EditComponent,
    data: {
      breadcrumb: 'Edit'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgentsRoutingModule { }
