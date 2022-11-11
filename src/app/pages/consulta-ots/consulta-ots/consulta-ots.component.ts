import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ConsultaOtsService } from '../../services/consulta-ots.service';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSnackBar } from '@angular/material/snack-bar';
import { subscribeOn } from 'rxjs';


@Component({
  selector: 'app-consulta-ots',
  templateUrl: './consulta-ots.component.html',
  styleUrls: ['./consulta-ots.component.css']
})
export class ConsultaOTsComponent implements AfterViewInit {

  id              : string          = localStorage.getItem('username')!;
  datos           : OTs          [] = [];
  ot_id           : string          = '';
  refCliente      : string          = '';
  nroTerminal     : string          = '';
  selectedEstado  : string          = '';
  selectedCliente : string          = '';
  cliente         : string          = '';
  tipoInterv      : string          = '';
  segOrden        : string          = '';
  asignacion      : string          = '';
  cierre          : string          = '';
  inicioFA!  : Date;
  finalFA!   : Date;
  inicioFC!  : Date;
  finalFC!   : Date;



  displayedColumns: string       [] = [
    'ot_id',
    'sRefCliente',
    'sDsPrioridad',
    'sDsEstadoCorta',
    'concepto_id',
    'tipo_id',
    'sNmComercio',
    'sDsCliFinal',
    'sDsDireccion',
    'sDsPoblacion',
    'cdubigeo_id',
    'sDsTelefono1',
    'zona_id',
    'dFcAsignacion',
    'dFcCierre',
  ]

  dataSource = new MatTableDataSource<OTs>(datos);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTable) tabla1!: MatTable<OTs>;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private consultaOtsService : ConsultaOtsService,
              private _liveAnnouncer: LiveAnnouncer,
              private snackBar : MatSnackBar) { }
  
  ngAfterViewInit(): void {}

  
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  limpiarTabla(){
    //this.datos = []; //limpiar la tabla
    this.tabla1.renderRows();  //refrescar la misma
  }

  limpiar(){
    this.ot_id            = '';
    this.refCliente       = '';
    this.nroTerminal      = '';
    this.selectedEstado   = '';
    this.selectedCliente  = '';
    //this.datos            = [];
    this.tabla1.renderRows();
    
  }

  aplicar(){ 
    if(this.ot_id){
      console.log('Entró en Orden de trabajo')
      this.consultaOtsService.getOTsPorId(this.id, this.ot_id)
      .subscribe(resp => {
        this.datos = resp.consunltarOtPorId
        this.dataSource = new MatTableDataSource<OTs>(this.datos);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator! = this.paginator;
        this.limpiarTabla();
      })
    }
    if(this.refCliente){
      console.log('Entró en Ref Cliente')
      this.consultaOtsService.getOTsPorRefCliente(this.id, this.refCliente)
      .subscribe(resp => {
        this.datos = resp.consultarOtPorRefCliente
        this.dataSource = new MatTableDataSource<OTs>(this.datos);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator! = this.paginator;
        this.limpiarTabla();
      })
    }
    if(this.nroTerminal){
      console.log('Entró en Nro de terminal')
      this.consultaOtsService.getOTsPorTerminal(this.id, this.nroTerminal)
      .subscribe(resp => {
        this.datos = resp.consultaOtPorTerminal
        this.dataSource = new MatTableDataSource<OTs>(this.datos);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator! = this.paginator;
        this.limpiarTabla();
      })
    }
    if(this.selectedEstado){ //si viene estado alguno
      if(this.selectedEstado === 'pendientes'){
        console.log('Entró en Estado pendientes')
        this.consultaOtsService.getOtsPorEstado(this.id, this.selectedEstado)
        .subscribe(resp => {
          this.datos = resp.pendientes
          this.dataSource = new MatTableDataSource<OTs>(this.datos);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator! = this.paginator;
          this.limpiarTabla();
        })
      }
  
      if(this.selectedEstado === 'activas'){
        console.log('Entró en Estado activas')
        this.consultaOtsService.getOtsPorEstado(this.id, this.selectedEstado)
        .subscribe(resp => {
          this.datos = resp.activas
          this.dataSource = new MatTableDataSource<OTs>(this.datos);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator! = this.paginator;
          this.limpiarTabla();
        })
      }
      if(this.selectedEstado === 'cerradas'){
        console.log('Entró en Estado cerradas')
        if(!this.inicioFC){
          //si viene estado cerradas y ningun otro filtro, o el filtro de visa, muestro este mensaje
          this.snackBar.open(`Consulta amplia, debe aplicar filtro de fecha de cierre`,
          'Aceptar', {
          duration: 7000,
          panelClass: ["bad-snackbar"],
          });
          return;

        }else if(this.selectedEstado === 'cerradas' && this.selectedCliente !== '' && (this.inicioFC && this.finalFC)){
          
          let inicioFC = this.inicioFC.toLocaleDateString();
          let finalFC  = this.finalFC.toLocaleDateString(); 
          this.consultaOtsService.getOtsPorEstadoCerrado(this.id, this.selectedEstado, this.selectedCliente, inicioFC, finalFC)
          .subscribe(resp => {
            console.log('aca cliente desde el front', this.selectedCliente)
            this.datos = resp.cerradasConCliente
            this.dataSource = new MatTableDataSource<OTs>(this.datos);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator! = this.paginator;
            if(this.datos.length !== 0){
              this.snackBar.open(`Se encontraron ${this.datos.length} Ots!`,
              'Aceptar', {
              duration: 7000,
              panelClass: ["success-snackbar"],
              });
              return;
            }
            if(this.datos.length === 0){
              this.snackBar.open(`No se encontraron Ots`,
              'Aceptar', {
              duration: 7000,
              panelClass: ["bad-snackbar"],
              });
            }
          })
        }else if(this.selectedEstado === 'cerradas' && this.selectedCliente === '' && this.inicioFC && this.finalFC){
          
          let inicioFC = this.inicioFC.toLocaleDateString();
          let finalFC  = this.finalFC.toLocaleDateString(); 
          this.consultaOtsService.getOtsPorEstadoCerradoSinCliente(this.id, this.selectedEstado, inicioFC, finalFC)
          .subscribe(resp => {
            this.datos = resp.cerradas
            this.dataSource = new MatTableDataSource<OTs>(this.datos);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator! = this.paginator;
            if(this.datos.length !== 0){
              this.snackBar.open(`Se encontraron ${this.datos.length} Ots!`,
              'Aceptar', {
              duration: 7000,
              panelClass: ["success-snackbar"],
              });
            }else{
              console.log('O Es este ?? SEGUNDO')
              this.snackBar.open(`No se encontraron Ots`,
              'Aceptar', {
              duration: 7000,
              panelClass: ["bad-snackbar"],
              });
            }
          })
        }      

        

          
      }
      if(this.selectedEstado === 'sinCerrar'){
        console.log('Entró en Estado sin cerrar')
        this.consultaOtsService.getOtsPorEstado(this.id, this.selectedEstado)
        .subscribe(resp => {
          this.datos = resp.sinCerrar
          this.dataSource = new MatTableDataSource<OTs>(this.datos);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator! = this.paginator;
          this.limpiarTabla();
        })
      }
    }

      if((this.inicioFA && this.finalFA) && this.selectedEstado === ''){
        console.log('entra por fechas de asignación')
        let inicioFAstring = this.inicioFA.toLocaleDateString()
        let finalFAstring  = this.finalFA.toLocaleDateString()
        console.log(inicioFAstring, finalFAstring)
        this.consultaOtsService.getOtsPorFechaAsignacion(this.id, inicioFAstring, finalFAstring)
        .subscribe(resp => {
          this.datos = resp.datosAsignacion
          this.dataSource = new MatTableDataSource<OTs>(this.datos);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator! = this.paginator;
          this.limpiarTabla();
        })
      }

      if((this.inicioFC && this.finalFC) && this.selectedEstado === ''){
        console.log('entro aca en fechas de cierres')
        let inicioFCstring = this.inicioFC.toLocaleDateString()
        let finalFCstring  = this.finalFC.toLocaleDateString()
        console.log(inicioFCstring, finalFCstring)
        this.consultaOtsService.getOtsPorFechaCierre(this.id, inicioFCstring, finalFCstring)
        .subscribe(resp => {
          this.datos = resp.datosCierre
          this.dataSource = new MatTableDataSource<OTs>(this.datos);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator! = this.paginator;
          this.limpiarTabla();
        }) 
      }


    }

}

/* 
CLIENTES PREDEFINIDO VISA
TIPO INTERV DEPENDE DE VISA, EDEN O TRANSALUD */


export interface OTs {
  AceptadaPorElTecnico            : string;
  Comentario                      : string;
  bImpedirCierresKOaTecnicos      : boolean;
  bKmBaseYGastosModificables      : number;
  bParadaTiempo                   : boolean;
  bParpadeo                       : number;
  bPilotajeCentralizado           : boolean;
  bReportarCierreManualPositivoWS : boolean;
  bReportarClienteViaHTTP         : boolean;
  cdubigeo_id                     : string;
  cliente_id                      : string;
  concepto_id                     : string;
  dFcAlmacen                      : string;
  dFcAsignacion                   : string;
  dFcCierre                       : string;
  dFcEntrada                      : string;
  estadoFac_id                    : number;
  estado_id                       : string;
  ot_id                           : string;
  ot_visita                       : number;
  producto_id                     : string;
  sDsCliFinal                     : string;
  sDsDireccion                    : string;
  sDsEstadoCorta                  : string;
  sDsPoblacion                    : string;
  sDsPrioridad                    : string;
  sDsTelefono1                    : string;
  sIdentificador                  : string;
  sIdentificadorRet               : string;
  sNmComercio                     : string;
  sRefCliente                     : string;
  tipo_id                         : string;
  zona_id                         : string;
}

const datos : OTs [] = [];
