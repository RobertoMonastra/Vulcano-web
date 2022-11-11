import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DevolucionRoutingModule } from './devolucion-routing.module';
import { MaterialModule } from '../../material/material.module';
import { DevolucionComponent } from './devolucion/devolucion.component';
import { IncluirUnidadesComponent } from './incluir-unidades/incluir-unidades.component';
import { FormsModule } from '@angular/forms';
import { AlbaranpreliminarComponent } from './albaranpreliminar/albaranpreliminar.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { QrScannerComponent } from 'src/app/shared/qr-scanner/qr-scanner.component';
import { ExcelReaderComponent } from 'src/app/shared/excel-reader/excel-reader.component';


@NgModule({
  declarations: [
    DevolucionComponent,
    IncluirUnidadesComponent,
    AlbaranpreliminarComponent,
    QrScannerComponent,
    ExcelReaderComponent
  ],
  imports: [
    CommonModule,
    DevolucionRoutingModule,
    MaterialModule,
    FormsModule,
    ZXingScannerModule
  ]
})
export class DevolucionModule { }
