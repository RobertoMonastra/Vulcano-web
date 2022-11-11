import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DialogoAceptarComponent } from 'src/app/shared/dialogo-aceptar/dialogo-aceptar.component';
import { EntregaService } from '../../services/entrega.service';

@Component({
  selector: 'app-entrega-resumen',
  templateUrl: './entrega-resumen.component.html',
  styleUrls: ['./entrega-resumen.component.css']
})
export class EntregaResumenComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['DETALLE', 'DELIVERY', 'ALBARAN', 'FECHA DE CREACION', 'TRANSPORTISTA', 'INFORMAR ENTREGA'];
  dataSource = new MatTableDataSource<UnidadesInfo>(UNIDADES_INFO);
  username:string = localStorage.getItem('username')!;//Se lee el username para el servicio
  sinEntregas:boolean=false;


  constructor(private entregaService : EntregaService, private dialog : MatDialog,
              private snackBar: MatSnackBar, private router: Router) { }
  ngOnInit(): void {
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit(): void {
    this.entregaService.getEntregasPendientes(this.username)
    .subscribe(resp => {
      UNIDADES_INFO = resp.entregasDevolPend
      this.dataSource.data = UNIDADES_INFO
      if(UNIDADES_INFO.length == 0){
        this.sinEntregas = true
      }
    });
    this.dataSource.paginator = this.paginator;
  }
  entregarDevol(albaranId:string, zona_id:string){
    const dialogRef = this.dialog.open(DialogoAceptarComponent, {});
    dialogRef.afterClosed().subscribe(result => {
      if(result === true){
        this.entregaService.postTransportista(albaranId, zona_id)
          .subscribe(resp => {
            if(resp.ok){
              this.snackBar.open(`Proceso finalizado`, 'Aceptar', { //SnackBar
                duration: 7000,
                panelClass: ["success-snackbar"], //Clases en el Style.css
              });
            }
          });
          this.ngAfterViewInit();
      }
    });
  }
}
interface UnidadesInfo {
  albaran:string;
  delivery:string;
  date: string;
  transportista: string;
  bentregado: boolean;
  bverificartransporte: boolean;
  bTecEntregado:boolean;
}

let UNIDADES_INFO: UnidadesInfo[] = [
  {
    albaran : '6709',
    delivery : '800000000',
    date : '11/12/1234',
    transportista : 'EPSA',
    bentregado: true,
    bverificartransporte:false,
    bTecEntregado:false
  }
];