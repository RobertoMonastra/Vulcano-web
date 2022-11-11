import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CuadresComponent } from './cuadres/cuadres.component';

const routes: Routes = [
  {
    path: '',
    component: CuadresComponent,
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CuadresStockRoutingModule { }
