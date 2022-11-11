import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnunciosComponent } from './anuncios/anuncios.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: 'home', component: AnunciosComponent },
      {
        path: 'devoluciones',
        loadChildren: () => import('../devolucion/devolucion.module').then( m => m.DevolucionModule ),
      },
      {
        path: 'recepcion',
        loadChildren: () => import('../recepcion/recepcion.module').then( m => m.RecepcionModule ),
      },
      {
        path: 'entrega',
        loadChildren: () => import('../entrega-transporte/entrega-transporte.module').then( m => m.EntregaTransporteModule ),
      },
      {
        path: 'cambio-estados',
        loadChildren: () => import('../cambio-estados/cambio-estados.module').then( m => m.CambioEstadosModule),
      }, 
      {
        path: 'consulta-stock',
        loadChildren: () => import('../consulta-stock/consulta-stock.module').then( m => m.ConsultaStockModule),
      },
      {
        path: 'consulta-ots',
        loadChildren: () => import('../consulta-ots/consulta-ots.module').then( m => m.ConsultaOTsModule),
      },
      { path: '**', redirectTo: 'home' },
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
