import { NgModule } from '@angular/core';

import { CambioEstadosComponent } from './cambio-estados/cambio-estados.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: CambioEstadosComponent,
  },
  
  { path: '**', redirectTo:''}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CambioEstadosRoutingModule { }
