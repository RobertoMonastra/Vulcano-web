import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsultaOTsRoutingModule } from './consulta-ots-routing.module';
import { ConsultaOTsComponent } from './consulta-ots/consulta-ots.component';
import { MaterialModule } from '../../material/material.module';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ConsultaOTsComponent
  ],
  imports: [
    CommonModule,
    ConsultaOTsRoutingModule,
    MaterialModule,
    FormsModule,
    
  ]
})
export class ConsultaOTsModule { }
