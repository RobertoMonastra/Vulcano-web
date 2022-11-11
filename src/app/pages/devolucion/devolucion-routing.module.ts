import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlbaranpreliminarComponent } from './albaranpreliminar/albaranpreliminar.component';
import { DevolucionComponent } from './devolucion/devolucion.component';
import { IncluirUnidadesComponent } from './incluir-unidades/incluir-unidades.component';

const routes: Routes = [
  {
    path: '',
    component: DevolucionComponent,
  },
  {
    path: 'incluir-unidades/:componente/:descripcion/:estado', 
    component: IncluirUnidadesComponent 
  },
  {
    path: 'albaran-preliminar', 
    component: AlbaranpreliminarComponent 
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
export class DevolucionRoutingModule { }
