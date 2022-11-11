import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable } from '@angular/material/table';
import { DetalleStockService } from '../../../services/detalle-stock.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';

import { ConsultaStockService } from '../../../services/consulta-stock.service';
import * as XLSX from 'xlsx';
import { QrScannerComponent } from '../../../../shared/qr-scanner/qr-scanner.component';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';





@Component({
  selector: 'app-detalle-stock',
  templateUrl: './detalle-stock.component.html',
  styleUrls: ['./detalle-stock.component.css']
})
export class DetalleStockComponent implements AfterViewInit{

  displayedColumns: string[]        = ['numSerie', 'componente_id', 'descripcion', 'estado', 'nDias', 'dFcEntrada']
  displayedColumnsSegundaTabla: string[] = ['numSerie', 'componente_id', 'descripcion', 'estado', 'fechUltMovimiento']
  displayedColumnsTerceraTabla: string[] = ['componente_id', 'descripcion', 'cantidad']
  id                : string          = localStorage.getItem('username')!;
  compoElegido:string='BUSCAR'; 
  numSerie          : string          = ''; 
  opcionElegida     : boolean         = true;
  mostrarDes        : boolean         = true;
  hide              : boolean         = true;
  auxNuevoEstado    : boolean         = true;
  nuevoEstado       : string          = '';
  usuarioSAP        : string          = localStorage.getItem('usuarioSAP')!;
  componente_id     : string          = '';
  usuario_id        : string          = localStorage.getItem('nombre')!;
  arrayStock        : any                   []   = [];
  arrayModulos      : any                   []   = []
  arrayComponentes  : any                   []   = [];
  datosComponente   : DetalleStockPorSerie  []   = [];
  dataSource        : DetalleStockPorSerie  []   = [...this.datosComponente]
  dataSourceModulos : Modulos               []   = []
  dataSourceComp    : ComponentesTotales    []   = []
  datosExcel        : ComponentesTotales    []   = [];
  datosExcel1       : Modulos               []   = [];
  /* datosExcelPorStock: DetalleStockPorSerie  []   = []; */
  cantComponentes   : number          = 0;
  cantModulos       : number          = 0;
  selectedValue     : string          = '';
  selectedValue1    : string          = '';
  mostrarImg        : boolean         = false;
  toolbar           : boolean         = false;
  inicioFecha       : string          = '';
  finalFecha        : string          = '';

  
  myControl = new FormControl('BASE OPCIONAL');
  options: string[] = [];
  filteredOptions: Observable<string[]> | undefined;
  
  //dataSource = new MatTableDataSource<DetalleStock>(datos);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTable) tabla1!: ElementRef;
  @ViewChild(MatTable) tabla2!: MatTable<ComponentesTotales>;
  @ViewChild(MatTable) tabla3!: ElementRef;

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  constructor(private detalleStock     : DetalleStockService,
              private dialog           : MatDialog,
              private snackBar         : MatSnackBar,
              private consultaStock    : ConsultaStockService,
              ) { }
 

  ngAfterViewInit(): void {

      this.consultaStock.consultaStock(this.id)
      .subscribe(resp => {
        this.arrayStock = resp.datosStock
        
      })

      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map (value => this._filter(value || '')),
      );
      
    }

    selectCompo(){
      /* this.deshabilitar=true
      this.numSerIncluir = '';
      this.cantIncluir = 1;
      console.log(this.compoElegido)
      for (const i of this.mascara) {
        if(i.componente_id == this.compoElegido){
          this.mascaraNumSerie = i.smascara;
          this.Composeriado = i.nSerie;
          this.deshabilitar=false;
          break
        }
      }
      console.log(this.mascaraNumSerie)
      this.mascaraNumSerie = new RegExp("9999999999");
      if(this.mascaraNumSerie.test(this.numSerIncluir)){
        console.log("bien")
      }else{
        console.log(this.mascaraNumSerie.test(this.numSerIncluir))
      } */
    }

    limpiarTabla(){
    this.dataSource = []; //limpiar la tabla
    this.dataSourceComp = [];
    this.dataSourceModulos = [];
    this.cantComponentes = 0;
    this.cantModulos = 0;
  }  
  
  enter(e:any){
    if(e.keyCode === 13){
      this.obtenerComponente();
    }
  }

  disableDesplegables(numSerie : string){
    numSerie = this.numSerie;
    if(this.numSerie !== ''){
      this.mostrarDes = false
    }
  }

  filtroNombre(){
    this.detalleStock.consultaStockComponentes(this.id)
    .subscribe(resp => {
      this.dataSourceComp = resp.datosComponentes
      this.dataSourceComp = this.dataSourceComp.filter((e)=>
          e.componente_id.includes(this.selectedValue)
          )
          
          this.dataSourceComp.forEach(res => {
            res.estado ? res.estado = 'Averiado' : res.estado = 'Disponible';
            this.datosExcel = this.dataSourceComp
          })
          this.cantComponentes = this.dataSourceComp.length;
          this.snackBar.open(`Se encontraron ${this.cantComponentes} Componentes, y ${this.cantModulos} Modulos`,
          'Aceptar', {
          duration: 7000,
          panelClass: ["success-snackbar"],
        }); 
        });
        }

  filtroEstado(){
    this.detalleStock.consultaStockComponentes(this.id)
    .subscribe(resp => {
      this.dataSourceComp = resp.datosComponentes
      this.dataSourceComp = this.dataSourceComp.filter((e)=>
          e.estado.toString() == this.selectedValue1.toString()
          )
          
          this.dataSourceComp.forEach(res => {
            res.estado ? res.estado = 'Averiado' : res.estado = 'Disponible';
            this.datosExcel = this.dataSourceComp
          })
          this.cantComponentes = this.dataSourceComp.length;
          this.snackBar.open(`Se encontraron ${this.cantComponentes} Componentes, y ${this.cantModulos} Modulos`,
          'Aceptar', {
          duration: 7000,
          panelClass: ["success-snackbar"],
        });
        });
  }
  limpiar(){
    this.limpiarTabla();
    this.selectedValue = '';
    this.selectedValue1 = '';
    this.numSerie = '';
  }
  
  aplicar(){
    this.limpiarTabla()

    //componentes
    console.log('PASO 1')
    this.detalleStock.consultaStockComponentes(this.id)
    .subscribe(resp => {
      this.arrayComponentes = resp.datosComponentes
      
      
        if(this.selectedValue1 === '' && this.selectedValue === '' && this.inicioFecha === ''){
          console.log('PASO 2')
        this.dataSourceComp = resp.datosComponentes
          this.dataSourceComp.forEach(res => {
            res.estado ? res.estado = 'Averiado' : res.estado = 'Disponible';
            this.datosExcel = this.dataSourceComp
          })
        this.cantComponentes = this.dataSourceComp.length;
        
        }
        
        if(this.selectedValue !== '' && this.selectedValue1 !== ''){
          
          console.log('PASO 3')
          let aux = this.arrayComponentes;
          this.dataSourceComp = aux.filter((e)=>
          e.componente_id.includes(this.selectedValue)
          )
          console.log('aca el datasourceCOMP con el primer filtro', this.dataSourceComp)
          this.dataSourceComp = this.dataSourceComp.filter((e)=>
          e.estado.toString() == this.selectedValue1.toString()
          )
          this.dataSourceComp.forEach(res => {
            res.estado ? res.estado = 'Averiado' : res.estado = 'Disponible';
            this.datosExcel = this.dataSourceComp
          })
          this.cantComponentes = this.dataSourceComp.length;
        this.snackBar.open(`Se encontraron ${this.cantComponentes} Componentes, y ${this.cantModulos} Modulos`,
        'Aceptar', {
        duration: 7000,
        panelClass: ["success-snackbar"],
        });
        }
      }); 
        if(this.selectedValue !== '' && this.selectedValue1 === ''){
          console.log('PASO 4')
          this.filtroNombre();
        }
        if(this.selectedValue === '' && this.selectedValue1 !== ''){
          console.log('PASO 5')
          this.filtroEstado();
        }
        if(this.inicioFecha !== '' && this.finalFecha !== ''){
          console.log('PASO 6')
          console.log(this.inicioFecha, this.finalFecha)
          this.detalleStock.consultaStockComponentes(this.id)
          .subscribe(resp => {
          this.dataSourceComp = resp.datosComponentes
          this.dataSourceComp.forEach(e =>{

            if(e.fechUltMovimiento <= this.finalFecha){
              console.log('muestra fecha de la base', e.fechUltMovimiento)
              console.log('muestra fecha de finalFecha', this.finalFecha)
              this.dataSourceComp = this.dataSourceComp.filter((e)=>
              e.fechUltMovimiento.includes(this.inicioFecha)
              )
            }
          })
          console.log('componentes en fechas', this.dataSourceComp)
        })
          //el back manda, YYYY-DD-MMTHH:MM:SSSZ
        }
      
      //modulos
      this.detalleStock.consultaStockModulos(this.id)
      .subscribe(resp => {
        this.arrayModulos = resp.datosModulos
        let aux = this.arrayModulos;
        this.dataSourceModulos = aux.filter((e) =>
        e.componente_id.includes(this.selectedValue)
        )
        this.datosExcel1 = this.dataSourceModulos;
        this.dataSourceModulos.forEach((e) =>{
          //revisar porque trae el último valor y no la suma de los mismos.
          this.cantModulos = parseInt(e.cantidad) 
        })
        this.snackBar.open(`Consulta Exitosa!`,
        'Aceptar', {
        duration: 7000,
        panelClass: ["success-snackbar"],
        });
      });
    
  }

  obtenerComponente(){
    this.limpiarTabla()
      if(this.numSerie === ''){
        this.aplicar();
        if(this.cantModulos === 0 && this.cantComponentes === 0){
          this.mostrarImg = true;
        }else{
          this.mostrarDes = false;
        }
    }else{
      
      this.detalleStock.consultaStockPorSerie(this.id, this.numSerie) //busca el componente
      .subscribe(resp=>{
      this.datosComponente = resp.componentePorSerie
      if(this.datosComponente.length !== 0){ //validacion de que no venga la respuesta en 0.
      this.id;
      this.numSerie;
      this.datosComponente[0]
      this.dataSource.push(this.datosComponente[0])
      /* this.datosExcelPorStock = this.dataSource; */
      this.cantComponentes = this.dataSource.length;
      if(this.cantModulos !== 0 && this.cantComponentes !== 0){
        this.mostrarImg = false;
      }else{
        this.mostrarImg = true;
      }
      }else{
        this.snackBar.open('Esta serie no existe en su STOCK', 'Cancelar')   //mensaje de error de la validacion superior  
      }
      
    })

    }
  }

  excelDownload(){ 

    //falta cambiar el false por disponible en la exportación de excel

    let workBook             = XLSX.utils.book_new();
    let sheetComp            = XLSX.utils.json_to_sheet(this.datosExcel);
    let sheetMod             = XLSX.utils.json_to_sheet(this.datosExcel1);
    /* let sheetCompPorSerie    = XLSX.utils.json_to_sheet(this.datosExcelPorStock) */

    XLSX.utils.book_append_sheet(workBook, sheetComp, "Componentes "+this.id);
    XLSX.utils.book_append_sheet(workBook, sheetMod, "Modulos "+this.id);
    /* XLSX.utils.book_append_sheet(workBook, sheetCompPorSerie, "Componente Serie: "+this.numSerie); */

    //cambia el nombre de las columnas
    XLSX.utils.sheet_add_aoa(sheetComp, [["Componente", "Fecha Ult Movimiento", "Estado", "N° Serie",
     "Descripción", "Días en Almacén"]], { origin: "A1" });
    XLSX.utils.sheet_add_aoa(sheetMod, [["Componente", "Descripción", "Cantidad"]], { origin: "A1"});
    /* XLSX.utils.sheet_add_aoa(sheetCompPorSerie, [["SerieLote ID", "Componente", "Descripción", "N° Serie",
     "Almacen ID", "Fecha Ult Movimiento", "Ubicación", "Listo", "Estado", "Días en Almacén"]], { origin: "A1"}); */
    //ajusta el ancho de las columnas
    let columnasSheet1 = [
      {wch:12},
      {wch:25},
      {wch:10},
      {wch:10},
      {wch:25},
      {wch:15},
    ];

    let columnasSheet2 = [
      {wch:25},
      {wch:35},
      {wch:10},
      
    ];

    /* let columnasSheet3 = [
      {wch:13},
      {wch:25},
      {wch:35},
      {wch:13},
      {wch:10},
      {wch:25},
      {wch:15},
      {wch:6},
      {wch:10},
      {wch:15},
    ]; */
    
  sheetComp["!cols"]          = columnasSheet1;
  sheetMod["!cols"]           = columnasSheet2;
  /* sheetCompPorSerie["!cols"]  = columnasSheet3; */

    //Buffer
    XLSX.write(workBook, {bookType:"xlsx", type: "buffer"})

    //String binario
    XLSX.write(workBook, {bookType: "xlsx", type: "binary"})

    XLSX.writeFile(workBook, ("Stock Usuario "+ this.id)+".xlsx")

  }

  botonQr(){
    const dialogRef = this.dialog.open(QrScannerComponent, {}); //Se abre el componente del boton QR
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      if(result){

          this.numSerie = result
          this.obtenerComponente()

      }
    });
  }


}

export interface DetalleStockPorSerie {

  almacen_id    : string;
  estado        : boolean;
  blisto        : boolean;
  componente_id : string;
  dFcEntrada    : string;
  descripcion   : string;
  nDias         : number;
  numSerie      : number;
  sMotivoSalida : string;
  serielote_id  : number;
  totalRes      : number
}

let datosCompXserie : DetalleStockPorSerie [] = [];

export interface Modulos {
  componente_id     : string;
  descripcion       : string;
  cantidad          : string;
  totalRes          : number;
}

let datosModulos : Modulos [] = [];

export interface ComponentesTotales {
  componente_id     : string;
  descripcion       : string
  numSerie          : string;
  estado            : boolean | string;
  ultMovimiento     : string;
  fechUltMovimiento : string;
  totalRes          : number;
}

let datosComponentes : ComponentesTotales [] = [];

export interface Material {
  value: string;
  viewValue: string;
}

