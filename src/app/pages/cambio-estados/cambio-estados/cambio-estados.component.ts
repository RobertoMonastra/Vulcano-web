import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { CambiarEstadosService } from '../../services/cambiar-estados.service';
import { MatTable } from '@angular/material/table';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QrScannerComponent } from '../../../shared/qr-scanner/qr-scanner.component';

import { DialogoCambioEstadoComponent } from '../../../shared/dialogo-cambio-estado/dialogo-cambio-estado.component';


@Component({
  selector: 'app-cambio-estados',
  templateUrl: './cambio-estados.component.html',
  styleUrls: ['./cambio-estados.component.css']
})
export class CambioEstadosComponent implements AfterViewInit{
  
  displayedColumns: string[]        = ['almacen_id', 'dFcEntrada', 'componente_id', 'descripcion', 'snmserie', 'baveriado', 'sMotivoSalida']
  id              : string          = localStorage.getItem('username')!; 
  numSerie        : string          = ''; 
  zona_id         : string          = localStorage.getItem('username')!;
  opcionElegida   : boolean         = true;
  mostrar         : boolean         = true;
  hide            : boolean         = true;
  auxNuevoEstado  : boolean         = true;
  nuevoEstado     : string          = '';
  usuarioSAP      : string          = localStorage.getItem('usuarioSAP')!;
  componente_id   : string          = '';
  usuario_id      : string          = localStorage.getItem('nombre')!;
  datosComponente : Componentes []  = [];
  dataSource = [...datosComponente]
  
  @ViewChild(MatTable) table!: MatTable<Componentes>;

  constructor(private cambiarEstadosService : CambiarEstadosService,
              private dialog                : MatDialog,
              private snackBar              : MatSnackBar) { }

  
  
  ngAfterViewInit(): void {
    
  }
  limpiarTabla(){
    this.dataSource = []; //limpiar la tabla
    this.table.renderRows();  //refrescar la misma
  }

  obtenerComponente(){ //codificación del buscador
      this.limpiarTabla();
      if(this.numSerie === ''){
      this.snackBar.open('Ingrese un serial e intente de nuevo', 'Aceptar', {
        duration: 7000,
        panelClass: ["bad-snackbar"], //snackbar error
      });
    }else{
      
      this.cambiarEstadosService.getComponente(this.numSerie, this.zona_id) //busca el componente
    .subscribe(resp=>{
      this.datosComponente = resp.datosComponente
      if(this.datosComponente.length !== 0){ //validacion de que no venga la respuesta en 0.
      this.zona_id;
      this.numSerie;
      this.dataSource.push(this.datosComponente[0])
      this.table.renderRows()
      
      }else{
        this.snackBar.open('Esta serie no existe en su STOCK', 'Cancelar')   //mensaje de error de la validacion superior  
      }
    })

    }
  }
  

  aceptar(cambioEstado:boolean, componente_id:string){
    const dialogRef = this.dialog.open(DialogoCambioEstadoComponent, {
    });
    dialogRef.afterClosed().subscribe(result =>{
      if(result===true){ //si de aceptar es SI
        
        /* this.datosComponente.forEach(e =>{
          if(e.nDias > 7){
            this.snackBar.open(`No se puede superar los 7 días del último movimiento de almacén`, 'Aceptar', {
              duration: 5000,
              panelClass: ["bad-snackbar"],
              
            });
          }else{  */

            if(cambioEstado){ //cambiar al valor opuesto de lo que trae baveriado
              this.auxNuevoEstado = false;
              this.nuevoEstado = '0';
            }else{
              this.auxNuevoEstado = true;    
              this.nuevoEstado = '1';
            }

            

              this.cambiarEstadosService.cambioEstado(this.zona_id, this.numSerie, this.nuevoEstado, componente_id, this.usuario_id, this.usuarioSAP)
              .subscribe(resp =>{ //sentencia post que pide el cambio de estado
                console.log(resp)
                if(!resp.ok){ //si la respuesta da error
                  this.snackBar.open(`${resp}`, 'Aceptar', {
                    duration:5000,
                    panelClass: ["bad-snackbar"],
                  }); 
                }else{ //si la respuesta da todo bien
                  this.snackBar.open(`${resp.msg}`, 'Aceptar', {
                    duration: 5000,
                    panelClass: ["success-snackbar"]
                  }); 
                  this.limpiarTabla()
                  this.obtenerComponente()
                }
              });
            
          /*  } 
         })  */
      }
    })

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

  enter(e:any){
    if(e.keyCode === 13){
      this.obtenerComponente();
    }
  }


}

export interface Componentes {
  almacen_id    : string;
  baveriado     : boolean; 
  blisto        : boolean;
  componente_id : string;
  dFcEntrada    : Date;
  descripcion   : string;
  nDias         : number;
  sMotivoSalida : string;
  serielote_id  : string;
  snmserie      : string;
}

const datosComponente: Componentes[] = [ //el endpoint debe llenar esta variable 
  ];
