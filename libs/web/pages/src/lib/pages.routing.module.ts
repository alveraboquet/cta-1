import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { pages } from './pages';


const routes: Routes = [
  {
    path: '',
    // canActivate: [AuthGuard],
    component: MainComponent,
    children: [
      {
        path: '',
        redirectTo: pages[0].route.path,
        pathMatch: 'full'
      },
      ...pages.map(page => page.route)
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
