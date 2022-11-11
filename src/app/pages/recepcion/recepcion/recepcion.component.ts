import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { RecepcionService } from '../../services/recepcion.service'
import { MatDialog } from '@angular/material/dialog';
import { DialogoAceptarComponent } from '../../../shared/dialogo-aceptar/dialogo-aceptar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';



@Component({
  selector: 'app-recepcion',
  templateUrl: './recepcion.component.html',
  styleUrls: ['./recepcion.component.css']
})
export class RecepcionComponent implements AfterViewInit {
  
  displayedColumns    : string[]          = ['DETALLE', 'cod', 'DeliveryDocument', 'fechGen', 'nroRemito', 'acuseRemito'];
  datos               : RequerimentRow [] = [];
  mostrar             : boolean           = true;
  opcionMD            : boolean           = true;
  enviado             : boolean           = true;
  DeliveryDocument = localStorage.getItem('DeliveryDocument')!;
  cod = localStorage.getItem('cod')!;
  nroRemito = localStorage.getItem('nroRemito')!;
  username = localStorage.getItem('username')

  constructor(private recepcionService : RecepcionService,
              private dialog : MatDialog,
              private snackBar : MatSnackBar,
              private route : Router){}
  
  //Instanciando la tabla de material
  dataSource = new MatTableDataSource<RequerimentRow>(datos);

  @ViewChild(MatPaginator) paginator!: MatPaginator;


  ngAfterViewInit() {
    this.dataSource.paginator! = this.paginator;

    
    let cod = localStorage.getItem('cod')
    let zona = localStorage.getItem('zona')
    
    
    

    this.recepcionService.getRecepciones(this.username!, cod!, zona!)
    .subscribe(resp => {
      
      this.datos = resp.resDetalle;
        
      this.dataSource = new MatTableDataSource<RequerimentRow>(resp.resDetalle);

      this.dataSource.paginator! = this.paginator;
      
      this.tablaLlena();
    })
  }



  //verificacion de existencia de datos.
  tablaLlena(){
    
    if (this.datos.length === 0){
      
      this.mostrar = false;
    }else{
      
      this.mostrar = true;
    }

  }


  aceptar(cod:string, DeliveryDocument:string, nroRemito:string){
    this.obtenerCod(this.cod, this.DeliveryDocument, this.nroRemito)
    const dialogRef = this.dialog.open(DialogoAceptarComponent, {
    });
    

    dialogRef.afterClosed().subscribe(resp => {
      if (resp === true){
        let DeliveryDocument = localStorage.getItem('DeliveryDocument')
        let nroRemito = localStorage.getItem('nroRemito')
        this.recepcionService.postNroRemito(this.username!, cod!, DeliveryDocument!, nroRemito!)
        .subscribe(resp => {
          
          console.log(resp)
             
        })
        this.datos.forEach(e =>{

            if(cod === e.cod) {
              e.bEnviado = true
            }
          });
      }
    });
  }

  obtenerCod(cod:string, DeliveryDocument:string, nroRemito:string){
        localStorage.removeItem('cod');
        localStorage.removeItem('DeliveryDocument')
        localStorage.removeItem('nroRemito')


        localStorage.setItem('cod', cod);
        localStorage.setItem('DeliveryDocument', DeliveryDocument);
        localStorage.setItem('nroRemito', nroRemito);
       
  }

  obtenerZona (zona: string){
    localStorage.setItem('zona', zona);
  }

 

}


export interface RequerimentRow {
  
  cod: string;
  DeliveryDocument: string;
  fechGen: Date; //debe ser Date
  nroRemito: string;
  bEnviado: boolean; //aca va boton
}

const datos: RequerimentRow[] = [ //el endpoint debe llenar esta variable
    /* {cod: '', nroDelivery: '', fechGen: new Date(), nroRemito: '', acuseRemito: false} */
    
  ]; 

