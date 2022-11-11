import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../../material/material.module';
import { EntregaTransporteRoutingModule } from './entrega-transporte-routing.module';
import { FormsModule } from '@angular/forms';
import { EntregaResumenComponent } from './entrega-resumen/entrega-resumen.component';
import { EntregaInformacionComponent } from './entrega-informacion/entrega-informacion.component';

@NgModule({
  declarations: [
    EntregaResumenComponent,
    EntregaInformacionComponent
  ],
  imports: [
    CommonModule,
    EntregaTransporteRoutingModule,
    MaterialModule,
  ]
})
export class EntregaTransporteModule { }
