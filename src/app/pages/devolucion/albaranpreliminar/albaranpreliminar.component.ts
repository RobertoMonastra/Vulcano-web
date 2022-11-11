import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DialogoAceptarComponent } from 'src/app/shared/dialogo-aceptar/dialogo-aceptar.component';
import { DevolucionService } from '../../services/devolucion.service';

@Component({
  selector: 'app-albaranpreliminar',
  templateUrl: './albaranpreliminar.component.html',
  styleUrls: ['./albaranpreliminar.component.css']
})
export class AlbaranpreliminarComponent implements AfterViewInit {
  displayedColumns: string[] = ['CODIGO', 'DESCRIPCIÓN', 'NSERIE', 'AVERIADO', 'ORIGEN', 'NCAJA'];
  dataSource = new MatTableDataSource<UnidadesInfo>([]);
  constructor(private devolucionService : DevolucionService, private dialog : MatDialog,
              private snackBar: MatSnackBar, private router: Router,) { }
  nBultos: number = 0;
  username:string='';
  exito:boolean=false;
  remitenteDatos = [{
    empresa: '',
    nombreZona: '',
    codigoUbigeo: '',
    direccion: '',
    poblacion: '',
    provincia: '',
    telefono:''
  }]
  usuario:string='';
  destinatarioDatos = this.remitenteDatos;
  maxBultos:number=0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void{
    UNIDADES_INFO3 = []
    this.username = localStorage.getItem('username')!;
    this.devolucionService.getDatosZona(this.username!)
      .subscribe(resp => { //Datos de remitente y destinatario
        this.remitenteDatos = resp.datosOrigen; 
        this.destinatarioDatos = resp.datosDestino; 
        this.usuario = resp.datosOrigen[0]['nombreZona']; //Dato necesario para el SP
      });

    UNIDADES_INFO2 = JSON.parse(sessionStorage.getItem('unidadesIncluidas')!); //Se toma el objeto grabado en incluirUnidades
    for (const i of UNIDADES_INFO2) {
      if(i.delivery == sessionStorage.getItem('ultDelivery')){
        UNIDADES_INFO3.push(i)
      }
    }
    this.maxBultos = UNIDADES_INFO2.length
    console.log(UNIDADES_INFO2)
    this.dataSource.data = UNIDADES_INFO3;
    this.dataSource.paginator = this.paginator;
  }

  generarAlb(){
    const dialogRef = this.dialog.open(DialogoAceptarComponent, {});
    UNIDADES_INFO2 = UNIDADES_INFO2.filter((item) => item.delivery != sessionStorage.getItem('ultDelivery')!)
    const totalUnidades = UNIDADES_INFO3.length;
    dialogRef.afterClosed().subscribe(result => {
      if(result === true){ 
        this.devolucionService.postAlbaran(this.username, this.nBultos, sessionStorage.getItem('ultDelivery')!, totalUnidades)
        .subscribe(resp => {
          console.log(resp)
          if(resp.ok){
            sessionStorage.removeItem('unidadesIncluidas'); //Limpia datos residuales
            this.snackBar.open(`${resp.msg}`, 'Aceptar', { //SnackBar
              panelClass: ["success-snackbar"], //Clases en el Style.css
            });
            this.exito = true; //Activa la animacion
            sessionStorage.removeItem('ultDelivery')
            setTimeout(() => { //Redireccion
              this.router.navigateByUrl('inicio/devoluciones')
            }, 4000);   
         }else{ //Si la respuesta es un error
          this.snackBar.open(`${resp}`, 'Aceptar', { //SnackBar
            duration: 10000,
            panelClass: ["bad-snackbar"], //Clases en el Style.css
          });
        }
        });
      }
    });
    //Fin del proceso
  }
}



//<------------------ Interfaces de las tablas ---------------------->

interface UnidadesInfo {
  componente: string;
  delivery:string;
  descripcion: string;
  incluir: boolean;
  averiado: boolean;
  numeroSerie: any;
  numeroCaja: number;
  unidadesSolicitadas: number;
}

let UNIDADES_INFO2: UnidadesInfo[] = [];
let UNIDADES_INFO3: UnidadesInfo[] = [];

