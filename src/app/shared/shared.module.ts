import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QrScannerComponent } from './qr-scanner/qr-scanner.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { ExcelReaderComponent } from './excel-reader/excel-reader.component';
import { MaterialModule } from '../material/material.module';


@NgModule({
  declarations: [
    QrScannerComponent,
  ],
  imports: [
    CommonModule,
    ZXingScannerModule,
    MaterialModule
  ],
  exports: [
    QrScannerComponent,
  ]
})
export class SharedModule { }
