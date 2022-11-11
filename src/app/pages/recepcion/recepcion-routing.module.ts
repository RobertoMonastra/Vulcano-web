import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CodDeliveryComponent } from './recepcion/cod-delivery/cod-delivery.component';
import { RecepcionComponent } from './recepcion/recepcion.component';

const routes: Routes = [
  {
    path: '',
    component: RecepcionComponent,
  },
  {
    path: 'codDelivery', 
    component: CodDeliveryComponent 
  },
  { path: '**', redirectTo:''}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecepcionRoutingModule { }
