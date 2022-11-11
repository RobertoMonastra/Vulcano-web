import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TokenValidateGuard } from './guards/token-validate.guard';
import { HomeComponent } from './pages/home/home/home.component';

const routes: Routes = [
  {
    path: 'iniciar-sesion',
    loadChildren: () => import('./auth/auth.module').then( m => m.AuthModule )
  },
  {
    path: 'inicio',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomeModule ),
    //canActivate: [TokenValidateGuard],
    //canLoad: [TokenValidateGuard]
  },
  {
    path: '**',
    redirectTo: 'iniciar-sesion'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true
  })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
