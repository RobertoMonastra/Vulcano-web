import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConsultaStockComponent } from './consulta-stock/consulta-stock.component';
import { DetalleStockComponent } from './consulta-stock/detalle-stock/detalle-stock.component';

const routes : Routes = [
  {
    path: '',
    component: ConsultaStockComponent
  },
  {
    path: 'detalleStock',
    component: DetalleStockComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
]



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultaStockRoutingModule { }
