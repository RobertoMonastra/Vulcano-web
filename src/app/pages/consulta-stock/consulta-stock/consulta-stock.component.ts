import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ConsultaStockService } from '../../services/consulta-stock.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import * as XLSX from 'xlsx';



@Component({
  selector: 'app-consulta-stock',
  templateUrl: './consulta-stock.component.html',
  styleUrls: ['./consulta-stock.component.css']
})
export class ConsultaStockComponent implements AfterViewInit {

  displayedColumns    : string[]          = ['componente_id', 'descripcion', 'nExActuales', 'nDevolver', 'sumaTotal'];
  datos               : Stock []          = [];
  datosExcel          : Stock []          = [];
  id                  : string            = localStorage.getItem('username')!;
  componente_id       : string            = '';
  descripcion         : string            = '';
  disponibles         : string            = '';
  averiados           : string            = '';
  stockTotal          : number            = 0;
  sumaTotal           : number            = 0;
  zona_id             : string            = '50000'
  toolbar             : boolean           = false;

  dataSource = new MatTableDataSource<Stock>(datos);


  constructor(private consultaStockService : ConsultaStockService,
              private snackBar : MatSnackBar,
              private dialog : MatDialog) { }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {

    
    this.dataSource.paginator! = this.paginator;
    
    this.consultaStockService.consultaStock(this.id)
    .subscribe(resp => {
      
      this.datos = resp.datosStock; //consulta que busca datos parecida a vulcano1, para mostrar en stock general.
      this.datosExcel = resp.datosExcel; //consulta que busca datos que se pidieron mostrar en excel.
      
      this.dataSource = new MatTableDataSource<Stock>(resp.datosStock);
    
      this.dataSource.paginator! = this.paginator;
      
     
    }) 
    
  }

  excelDownload(){ 

    

    console.log('acaaaaaaaa', this.datosExcel)

    const workSheet = XLSX.utils.json_to_sheet(this.datosExcel);
    const workBook  = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workBook, workSheet, "Stock Usuario "+this.id)

    //ajusta el ancho de las columnas
    const columnas = [
      {wch:10},
      {wch:25},
      {wch:35},
      
  ];
    
    workSheet["!cols"] = columnas;

    //Buffer
    XLSX.write(workBook, {bookType:"xlsx", type: "buffer"})

    //String binario
    XLSX.write(workBook, {bookType: "xlsx", type: "binary"})

    XLSX.writeFile(workBook, ("Stock Usuario "+ this.id)+".xlsx")

  }

}


export interface Stock {

  ExistenciasEnTransito : number;
  almacen_id            : string;
  componente_id         : string;
  descripcion           : string;
  nDevolver             : number;
  nExActuales           : number;
  nExReservado          : number;
  nListos               : number;
  nNivelReposicion      : number;
   
}

const datos : Stock [] = [];
