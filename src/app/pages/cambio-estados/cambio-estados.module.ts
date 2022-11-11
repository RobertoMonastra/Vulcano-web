import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CambioEstadosComponent } from './cambio-estados/cambio-estados.component';
import { CambioEstadosRoutingModule } from './cambio-estados-routing.module';
import { MaterialModule } from '../../material/material.module';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    CambioEstadosComponent,
    
  ],
  imports: [
    CommonModule,
    CambioEstadosRoutingModule,
    MaterialModule,
    FormsModule
  ]
})
export class CambioEstadosModule { }
