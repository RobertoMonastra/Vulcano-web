import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module';

import { CuadresStockRoutingModule } from './cuadres-stock-routing.module';
import { CuadresComponent } from './cuadres/cuadres.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';


@NgModule({
  declarations: [
    CuadresComponent
  ],
  imports: [
    CommonModule,
    CuadresStockRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class CuadresStockModule { }
