import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/compat/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['auth']);

const routes: Routes = [
  {
    path: '',
    ...canActivate(redirectUnauthorizedToLogin),
    loadChildren: () => import('@cta/web/pages').then(mod => mod.PagesModule),
  },
  {
    path: 'auth',
    loadChildren: () => import('@cta/web/auth').then(mod => mod.AuthModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
