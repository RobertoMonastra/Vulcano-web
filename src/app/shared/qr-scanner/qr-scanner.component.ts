import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { BarcodeFormat } from '@zxing/library';

@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.component.html',
  styleUrls: ['./qr-scanner.component.css']
})
export class QrScannerComponent implements OnInit {
  opcionElegida:boolean=false;
  allowedFormats = [ BarcodeFormat.QR_CODE, BarcodeFormat.EAN_13, BarcodeFormat.CODE_128, BarcodeFormat.DATA_MATRIX /*, ...*/ ];
  qrResultString: string = '';
  constructor(public dialogRef: MatDialogRef<QrScannerComponent>,
             ) { }

  ngOnInit(): void {
    
  }

  onCodeResult(resultString: string) {
    this.qrResultString = resultString;
    console.log(this.qrResultString)
    this.dialogRef.close(this.qrResultString);
  }

  no(){
    this.opcionElegida = false;
    this.dialogRef.close(this.opcionElegida);
  }

}
