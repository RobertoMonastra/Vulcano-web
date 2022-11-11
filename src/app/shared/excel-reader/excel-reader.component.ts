import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import * as XLSX from 'xlsx';

type AOA = any[][];
interface UnidadesInfo {
  componente:string;
  descripcion:string;
  incluir: boolean;
  averiado: any;
  numeroSerie: any;
  numeroCaja: number;
}


let UNIDADES_INFO: UnidadesInfo[] = [];
@Component({
  selector: 'app-excel-reader',
  templateUrl: './excel-reader.component.html',
  styleUrls: ['./excel-reader.component.css']
})
export class ExcelReaderComponent implements OnInit {
  data: AOA = [[1, 2], [3, 4]];
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  fileName: string = 'SheetJS.xlsx';
  constructor(public dialogRef: MatDialogRef<ExcelReaderComponent>) { }
  opcionElegida:boolean = false;
  disabled:boolean = true;
  ngOnInit(): void {
    console.log(this.data);
  }
  onFileChange(evt?: any) {

    /* Cuando se renderiza el archivo */
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Solo se puede subir de a un archivo');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      this.disabled = false;
      /* Leer el archivo */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* Seleccion la primer columna */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* Guardar la informacion */
      this.data = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));

      let index = 1;
      while (index < this.data.length) {
        if(this.data[index][0]){
          UNIDADES_INFO.push({
            numeroSerie: `${this.data[index][0]}`,
            componente: this.data[index][1],
            descripcion: '',
            incluir: true,
            averiado: '',
            numeroCaja: 0,
          });
          
        }
        index++
      }
    };
    reader.readAsBinaryString(target.files[0]);
    
  }
  si(){
    this.opcionElegida = true;
    sessionStorage.removeItem('unidadesIncluidas');
    this.dialogRef.close(UNIDADES_INFO);
    UNIDADES_INFO = [];
  }

  no(){
    this.opcionElegida = false;
    this.dialogRef.close(this.opcionElegida);
  }
}
