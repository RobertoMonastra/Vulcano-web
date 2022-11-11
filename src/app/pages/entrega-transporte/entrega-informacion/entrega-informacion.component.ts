import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params } from '@angular/router';
import { DevolucionService } from '../../services/devolucion.service';
import { EntregaService } from '../../services/entrega.service';

@Component({
  selector: 'app-entrega-informacion',
  templateUrl: './entrega-informacion.component.html',
  styleUrls: ['./entrega-informacion.component.css']
})
export class EntregaInformacionComponent implements AfterViewInit{
  displayedColumns: string[] = ['CODIGO', 'DESCRIPCION', 'CODIGO SAP', 'NROSERIE', 'AVERIADO', 'ORIGEN', 'CANTIDAD'];
  dataSource = new MatTableDataSource<UnidadesInfo>(UNIDADES_INFO);
  remitenteDatos = [{
    empresa: '',
    nombreZona: '',
    codigoUbigeo: '',
    direccion: '',
    poblacion: '',
    provincia: '',
    telefono:''
  }]
  username:string='';
  usuario:string='';
  albaranId:number=0;
  delivery:string='';
  nCajas:number=0;
  fCreacion:any=0;
  algo:any;

  destinatarioDatos = this.remitenteDatos;
  constructor(private entregaService : EntregaService ,private devolucionService : DevolucionService,
              private activatedRoute: ActivatedRoute, ) { }
              
              
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {
    this.algo=null
    this.activatedRoute.params
      .subscribe(
        (params: Params) => {
          this.albaranId = params['componente'];
        }
      );
    this.username = localStorage.getItem('username')!;
    this.devolucionService.getDatosZona(this.username!)
      .subscribe(resp => { //Datos de remitente y destinatario
        this.remitenteDatos = resp.datosOrigen; 
        this.destinatarioDatos = resp.datosDestino; 
        this.usuario = resp.datosOrigen[0]['nombreZona']; //Dato necesario para el SP
      });

    this.entregaService.getEntregasInfo(this.albaranId)
      .subscribe(resp=> {
        UNIDADES_INFO = resp.entregasDevolPend;
        this.dataSource.data = UNIDADES_INFO;
        console.log(UNIDADES_INFO)
        this.delivery = resp.datosAlb[0]['DeliveryDocument']
        this.nCajas = resp.datosAlb[0]['HUNumber']
        this.fCreacion = resp.datosAlb[0]['dFcGeneracion']
        this.algo=UNIDADES_INFO;
      });
    this.dataSource.paginator = this.paginator;
  }

  imprim2(){
    let mywindow = window.open('', 'PRINT', 'height=400,width=600')!;
    mywindow.document.write('<html><head>');
    mywindow.document.write('<style> #muestra{padding: 15px;}.datosAlb{display: flex;}.datosAlb div {width: 50%;}.datosEnvio{border: solid black 1px;padding: 15px;}</style>');
    mywindow.document.write('</head><body >');
    mywindow.document.write(document.getElementById('muestra')!.innerHTML);
    mywindow.document.write('</body></html>');
    mywindow.document.close(); // necesario para IE >= 10
    mywindow.focus(); // necesario para IE >= 10
    mywindow.print();
    mywindow.close();
    return true;
  }
}

interface UnidadesInfo {
  CODIGO: string,
  descripcion: string,
  CODIGOSAP: string,
  NroSERIE: string,
  AVERIADO: boolean,
  ORIGEN: string,
  CANTIDAD: string,
}

let UNIDADES_INFO: UnidadesInfo[] = [
  {
    CODIGO : '1',
    descripcion:'6',
    CODIGOSAP : '2',
    NroSERIE : '3',
    AVERIADO : true,
    ORIGEN : '5',
    CANTIDAD : '6',
  },
];