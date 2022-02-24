import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './components/list/list.component';
import { DetailComponent } from './components/detail/detail.component';

const routes: Routes = [
  {
    path: '',
    component: ListComponent,
  },
  {
    path: 'detail',
    component: DetailComponent,
    data: {
      breadcrumb: 'Detail'
    }
  },
  {
    path: 'detail/:id',
    component: DetailComponent,
    data: {
      breadcrumb: 'Detail'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackTestsRoutingModule { }
