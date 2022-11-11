import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';

import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogoAceptarComponent } from '../../../../shared/dialogo-aceptar/dialogo-aceptar.component';
import { DialogoCancelarComponent } from '../../../../shared/dialogo-cancelar/dialogo-cancelar.component';
import { RecepcionService } from '../../../services/recepcion.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogoAceptarParcialComponent } from '../../../../shared/dialogo-aceptar-parcial/dialogo-aceptar-parcial.component';






@Component({
  selector: 'app-cod-delivery',
  templateUrl: './cod-delivery.component.html',
  styleUrls: ['./cod-delivery.component.css']
})
export class CodDeliveryComponent implements AfterViewInit {
 
  displayedColumns        : string[]  = ['checkbox', 'COMPONENTE',  'transitosalida_id', 'numSerie', 'CANTIDAD', 'CANTIDADRECIBIDA'];
  displayedColumns1       : string [] = ['checkbox', 'numSerie', 'componente_id', 'COMPONENTE' ]
  muestraNoSer            : boolean   = true;
  muestraSer              : boolean   = true;
  username                : string    = localStorage.getItem('username')!;
  DeliveryDocument        : string    = localStorage.getItem('DeliveryDocument')!;
  cod                     : string    = localStorage.getItem('cod')!;
  zona                    : string    = localStorage.getItem('usuario_id')!;
  nroRemito               : string    = localStorage.getItem('nroRemito')!;
  delegacion_id           : string    = '50000';
  claves                  : string    = '';
  arrayClaves             : string [] = [];
  sClaves                 : string    = '';
  usuario_id              : string    = '';
  componentesReceptados   : number    = 0;
  sComponentesReceptados  : string    = '';
  cantidadRecibida        : string    = '';
  cantRecibida            : string    = '';
  incluidoNoSer           : boolean   = false;
  incluidoSer             : boolean   = false;
  datos                   : RequerimentComponent [] = [];
  datos1                  : CompNoSerializados []   = [];
  datos3                  : ValidarAcuseRemito []       = [];
  
  selection = new SelectionModel<any>(true, []);

  constructor(private router : Router,
              private dialog : MatDialog,
              private recepcionService: RecepcionService,
              private snackBar : MatSnackBar) { }

  dataSource = new MatTableDataSource<RequerimentComponent>(this.datos);
  dataSource1 = new MatTableDataSource<CompNoSerializados>(this.datos1);
  dataSource3 = new MatTableDataSource<ValidarAcuseRemito>(this.datos3);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('allPaginator', {read: MatPaginator}) allPaginator!:MatPaginator;
  @ViewChild(MatTable) myTable!: MatTable <any>;
  @ViewChild('select') select!: MatSelect

  
  
  ngAfterViewInit(): void {
    
    //this.incluido = this.incluido + 1;
    this.dataSource.paginator! = this.paginator;
    this.dataSource1.paginator! = this.allPaginator;

    this.recepcionService.getCodDelivery(this.username!, this.cod!, this.zona!, this.DeliveryDocument!, this.nroRemito!)
    .subscribe(resp => {
    this.datos = resp.compSer;
    this.datos1 = resp.compNoSer;
    this.datos3 = resp.recepciones;

    this.dataSource = new MatTableDataSource<RequerimentComponent>(this.datos)
    this.dataSource1 = new MatTableDataSource<CompNoSerializados>(this.datos1)
    
    this.mostrarNoSer()
    this.mostrarSer()
    
    this.dataSource1.paginator! = this.paginator;
    this.dataSource.paginator! = this.allPaginator;
    
    })
  }

  //Suma y resta del contador de unidades requeridas
   reqContador(checked: boolean) {
    
    this.incluidoNoSer = false;
    for (const e of this.datos1) {
      if(e.incluir){
        this.incluidoNoSer = true;
        break;
      }
    }
    this.incluidoSer = false;
    for (const e of this.datos) {
      if(e.incluir){
        this.incluidoSer = true;
        break;
      }
    }
  }
  

  

 //all los check seleccionados
  get allSelectedNoSer(): boolean {
    return this.selection.selected.length === this.datos1.length;
  }

  get allSelectedSer(): boolean {
    return this.selection.selected.length === this.datos.length;
  }

  selectAllNoSer(){
    
    if (this.allSelectedNoSer){
      this.datos1.forEach(e =>{
        e.incluir = false;
      })
      this.selection.clear();
    }else{
      this.datos1.forEach(e =>{
        e.incluir = true;
        this.reqContador(true)
      })
      this.selection.select(...this.datos1)
    }
  }

  selectAllSer(){
    if (this.allSelectedSer){
      this.datos.forEach(e => {
        e.incluir = false;
      })
      this.selection.clear();
    }else{
      this.datos.forEach(e => {
        e.incluir = true;
        this.reqContador(true)
      })
      this.selection.select(...this.datos)
    }
  }
  valorSeleccion(){ //funcion vacia para referenciar
    //TODO
    
  }

  valorSeleccion1(){ //funcion vacia para referenciar
    //TODO
    
  }
  
  //Acciones botones ACEPTAR CANCELAR
 
  limpiarAceptar(){

    this.sClaves = '';
    localStorage.removeItem('sClaves')
    this.sComponentesReceptados = '';
    localStorage.removeItem('sComponentesReceptados')
  }

  limpiarAceptar2(){

    this.sClaves = '';
    localStorage.removeItem('sClaves')
    
  }


  aceptar(){
    this.getTransitoSalidaIDConsumibles()
    
    
    let parar = 0;
    let aceptarParcial = false;
    let cantidadMayor = false;
    for (const e of this.datos3) {
      if(parar == 1){
        break
      }
      if(e.bEnviado === 0){
        this.snackBar.open('Para receptar Componentes/Consumibles, debe realizar Acuse del Remito', 'Aceptar', {
          duration: 10000,
          panelClass: ["bad-snackbar"], //snackbar error
        });
        this.limpiarAceptar()
        return;
      }else{
        //this.datos1.forEach(e =>{
          for (const e of this.datos1) {
            
          
          if(e.incluir) //si elemento se incluye
          if(e.CANTIDADRECIBIDA < e.CANTIDAD){//si cantidad recibida del técnico es menor a la cantidad
            parar = 1;
            aceptarParcial = true;
             
            if(e.CANTIDADRECIBIDA < 0 ){
              this.snackBar.open('No se pueden ingresar números negativos', 'Aceptar', {
                duration: 10000,
                panelClass: ["bad-snackbar"]
              })
              this.limpiarAceptar();
              parar = 1
              return;
            }           
            
            
          }else{
            if(e.CANTIDADRECIBIDA > e.CANTIDAD){ //si cantidad es menor
              cantidadMayor = true;
              console.log('aca esta',e.CANTIDADRECIBIDA, e.CANTIDAD)
              this.snackBar.open('La cantidad receptada no puede ser mayor a la cantidad indicada', 'Aceptar', {
                duration: 10000,
                panelClass: ["bad-snackbar"]
              })
              this.limpiarAceptar();
              parar = 1;
              break
              //corto proceso
           }
        }
      
        }      
      }
    }
  if (parar == 0){
    
  const dialogRef = this.dialog.open(DialogoAceptarComponent, { //si es igual

  });
  dialogRef.afterClosed().subscribe(result=> {
    if(result === true){
      this.recepcionService.postAceptarConsumibles(this.username, this.sClaves, this.usuario_id, this.delegacion_id, this.sComponentesReceptados)
      .subscribe(res => { //recibo cantidad total
        if(!res.ok){
          this.snackBar.open(res.msg, 'Aceptar', {
            duration: 7000,
            panelClass: ["bad-snackbar"], //snackbar error
        });
        }else{

          localStorage.getItem(this.username);
          this.sClaves = JSON.parse(localStorage.getItem('sClaves')!);
          localStorage.getItem(this.usuario_id);
          localStorage.getItem(this.delegacion_id);
          localStorage.getItem(this.sComponentesReceptados);
          console.log(res)
          this.snackBar.open('El modulo seleccionado, fue imputado correctamente', 'Aceptar', {
            duration: 7000,
            panelClass: ["success-snackbar"], //snackbar error
          });
          this.limpiarAceptar();
           setTimeout(() => {
            window.location.reload();
          }, 2000)
        }
      })
    }else{
      this.limpiarAceptar();
    }
  })
}else if (parar == 1 && aceptarParcial && !cantidadMayor){
  const dialogRef = this.dialog.open(DialogoAceptarParcialComponent, { //aviso de incidencia
  });
  dialogRef.afterClosed().subscribe(result =>{
    if(result === true){ //y recibo parcial de igual manera
        this.recepcionService.postAceptarConsumibles(this.username, this.sClaves, this.usuario_id, this.delegacion_id, this.sComponentesReceptados)
        .subscribe(res =>{
            if(!res.ok){
              this.snackBar.open(res.msg, 'Aceptar', {
                duration: 7000,
                panelClass: ["bad-snackbar"], //snackbar error
            });
            }else{

              localStorage.getItem(this.username);
              this.sClaves = JSON.parse(localStorage.getItem('sClaves')!);
              localStorage.getItem(this.usuario_id);
              localStorage.getItem(this.delegacion_id);
              localStorage.getItem(this.sComponentesReceptados);
              
              this.snackBar.open('El modulo seleccionado, fue imputado correctamente', 'Aceptar', {
                duration: 7000,
                panelClass: ["success-snackbar"], //snackbar success
              });
              setTimeout(() => {
                window.location.reload();
              }, 2000)
            }
        
          });
      
      }else{
        
        this.limpiarAceptar();
      }
  })
}
  }

  aceptar2(){
    this.getTransitoSalidaIDNoConsumibles()

    this.datos3.forEach(e =>{
      console.log('benviado', e.bEnviado)
      if(e.bEnviado === 0){
        this.snackBar.open('Para receptar Componentes/Consumibles, debe realizar Acuse del Remito', 'Aceptar', {
          duration: 10000,
          panelClass: ["bad-snackbar"], //snackbar error
        });
        this.limpiarAceptar2()
        return
      }else{
        const dialogRef = this.dialog.open(DialogoAceptarComponent, {
        });
        dialogRef.afterClosed().subscribe(result => {
          
            if(result === true){
              this.sClaves = JSON.parse(localStorage.getItem('sClaves')!)
              if(this.sClaves.length > 4000){
                this.snackBar.open('Se ha superado la cantidad máxima de ítems seleccionados, deseleccione un material por completo e intente nuevamente (MAXIMO 570)',
                'Aceptar', {
                  duration: 10000,
                  panelClass: ["bad-snackbar"]
                });
                
                this.limpiarAceptar2()

              }else{
                this.recepcionService.postAceptarNoConsumibles(this.username, this.sClaves, this.usuario_id, this.delegacion_id)
                .subscribe(res =>{
                  
                  if(res.ok){
                    this.snackBar.open('El componente seleccionado, fue recibido correctamente', 'Aceptar', {
                      duration: 7000,
                      panelClass: ["success-snackbar"], //snackbar error
                  });
                    setTimeout(() => {
                    window.location.reload();
                  }, 2000)
                  
                  }else{

                    this.snackBar.open(res.msg, 'Aceptar', {
                      duration: 7000,
                      panelClass: ["bad-snackbar"], //snackbar error
                  });
                  }
                });
                }
              this.limpiarAceptar2()
          }
          this.limpiarAceptar2()
        })
      }
    })
    
  }

  
        
   
  /* cancelar(){
    const dialogRef = this.dialog.open(DialogoCancelarComponent, {
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result === true){
        this.router.navigateByUrl('inicio/recepcion')
      }
    });
  } */

  mostrarNoSer(){
    if(this.datos1.length === 0)
    {
      this.muestraNoSer = false;
    }else{
      this.muestraNoSer = true;
    }
    console.log(this.datos1.length)
  }

  mostrarSer(){
    if(this.datos.length === 0)
    {
      this.muestraSer = false;
    }else{
      this.muestraSer = true;
    }
  }

  obtenerDatosNoConsumibles(sClaves : string , usuario_id:string, delegacion_id:string){
    localStorage.setItem('sClaves', JSON.stringify(sClaves))
    localStorage.setItem('usuario_id', usuario_id)
    localStorage.setItem('delegacion_id', delegacion_id)
    
  }

  getTransitoSalidaIDConsumibles() {
    if(this.datos1.length != 0){ 
      this.datos1.forEach((e)=>{
       
        if(e.incluir)
          {
          this.claves = JSON.stringify(e.transitosalida_id + '#');
          this.sClaves += String(eval(this.claves))
          this.usuario_id = e.almDestino_id;
          /* this.componentesReceptados = Math.round(e.CANTIDADRECIBIDA)
          this.cantRecibida = JSON.stringify(this.componentesReceptados)
          this.cantidadRecibida += '#'*/
          this.cantRecibida = Math.round(e.CANTIDADRECIBIDA) + '#'; //validación de números decimales!
          this.sComponentesReceptados += this.cantRecibida; 
          
          console.log('comp receptados', this.sComponentesReceptados)
          //this.value = Math.round(this.value);
             
          }
        })
  
        this.obtenerDatosNoConsumibles(this.sClaves, this.usuario_id, this.delegacion_id)
        localStorage.setItem('sComponentesReceptados', this.sComponentesReceptados);
        console.log(this.sClaves, this.usuario_id, this.sComponentesReceptados)
      }
  }

  getTransitoSalidaIDNoConsumibles() {
    
  if(this.datos.length != 0){ 
    this.datos.forEach((e, index)=>{
      
      if(e.incluir)
        {
        this.claves = JSON.stringify(this.datos[index].transitosalida_id + '#');
        this.sClaves += String(eval(this.claves))
        this.usuario_id = this.datos[index].almDestino_id;
            
        }
      })

      this.obtenerDatosNoConsumibles(this.sClaves, this.usuario_id, this.delegacion_id)
      console.log(this.sClaves, this.usuario_id)
    }

  } 
}
//interfaz para datos de tablo, comp no serializados
export interface CompNoSerializados {
  deshabilitado: boolean;
  incluir: boolean;
  CANTIDAD : number;
  componente: string;
  CANTIDADRECIBIDA: 0;
  albaran_id: string
  almDestino_id: string
  almOrigen_id: string
  almTransito_id: string
  bRecibido: string
  componente_id: string
  dFcEntrada: string
  dFcSalida: null
  numSerie: string
  otOrigen: null
  transitosalida_id: number
}

//let datos1: CompNoSerializados [] = [] ;


//interfaz para datos de tabla, componentes serializados
export interface RequerimentComponent {
  deshabilitado: boolean;
  incluir: boolean;
  numSerie: string;
  DESCRIPCION: string;
  CANTIDAD: string;
  COMPONENTE: string;
  almDestino_id: string
  almOrigen_id: string
  almTransito_id: string
  bRecibido: string
  componente_id: string
  dFcEntrada: string
  dFcSalida: null
  otOrigen: null
  transitosalida_id: number
}
//datos hardcodeados para la implementacion de la tabla
//let datos: RequerimentComponent [] = [];
export interface ValidarAcuseRemito {
  cod: string;
  DeliveryDocument: string;
  fechGen: Date; //debe ser Date
  nroRemito: string;
  bEnviado: number; //aca va boton
}




  


