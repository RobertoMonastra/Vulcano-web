import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsultaStockComponent } from './consulta-stock/consulta-stock.component';
import { ConsultaStockRoutingModule } from './consulta-stock-routing.module';
import { MaterialModule } from '../../material/material.module';
import { FormsModule } from '@angular/forms';
import { DetalleStockComponent } from './consulta-stock/detalle-stock/detalle-stock.component';
import { MatNativeDateModule } from '@angular/material/core';


@NgModule({
  declarations: [
    ConsultaStockComponent,
    DetalleStockComponent,
    
  ],
  imports: [
    CommonModule,
    ConsultaStockRoutingModule,
    MaterialModule,
    FormsModule,
    MatNativeDateModule
  ]
})
export class ConsultaStockModule { }