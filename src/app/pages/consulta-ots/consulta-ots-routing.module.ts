import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultaOTsComponent } from './consulta-ots/consulta-ots.component';


const routes: Routes = [
  {
    path: '',
    component: ConsultaOTsComponent
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
export class ConsultaOTsRoutingModule { }
