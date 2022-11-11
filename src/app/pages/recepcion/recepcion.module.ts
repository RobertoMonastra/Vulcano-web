import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecepcionRoutingModule } from './recepcion-routing.module';
import { RecepcionComponent } from './recepcion/recepcion.component';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../material/material.module';
import { CodDeliveryComponent } from './recepcion/cod-delivery/cod-delivery.component';



@NgModule({
  declarations: [
    RecepcionComponent,
    CodDeliveryComponent,
 
  ],
  imports: [
    CommonModule,
    RecepcionRoutingModule,
    MaterialModule,
    FormsModule
  ]
})
export class RecepcionModule { }
