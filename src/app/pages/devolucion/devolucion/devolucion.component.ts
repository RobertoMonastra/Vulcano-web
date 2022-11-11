import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { DialogoAceptarComponent } from 'src/app/shared/dialogo-aceptar/dialogo-aceptar.component';
import { DevolucionService } from '../../services/devolucion.service';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-devolucion',
  templateUrl: './devolucion.component.html',
  styleUrls: ['./devolucion.component.css']
})

export class DevolucionComponent implements AfterViewInit, OnInit {
  pendientes: number[] = [] //Botones receptores de la peticion
  displayedColumns: string[] = ['position', 'COMPONENTE', 'DESCRIPCION', 'UNIDADES', 'ESTADO'];
  checked: boolean = false;
  mostrar: boolean = true;
  toolbar: boolean = false;
  devolucionSeleccionada: number | string = 0;
  httpResp: any;
  validator: string = sessionStorage.getItem('unidadesIncluidas')!;
  componentesError: string = '';
  accesoAlb: boolean = false;
  mostrarAlerta: boolean = false;

  constructor(private devolucionService: DevolucionService, private dialog: MatDialog,
    private snackBar: MatSnackBar,) { }

  ngOnInit(): void {
    COMPONENTES = [{ position: 0, componente: 'ninguno', descripcion: '---', unidades: 0, seleccionado: false, estado: 'CTRL', delivery: '0' }];
    COMPONENTES_DATA = [{ position: 0, componente: 'ninguno', descripcion: '---', unidades: 0, seleccionado: false, estado: 'CTRL', delivery: '0' }];
  }

  //Construccion de la tabla de material
  dataSource = new MatTableDataSource<DetallesDelv>(DETALLES_DATA);
  dataSource2 = new MatTableDataSource<ComponentesStock>(COMPONENTES);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('allPaginator', { read: MatPaginator }) allPaginator!: MatPaginator;//Segundo paginator

  @ViewChild(MatTable) myTable!: MatTable<any>;

  ngAfterViewInit() {
    if (this.validator) {
      UNIDADES_INFO3 = JSON.parse(sessionStorage.getItem('unidadesIncluidas')!) //Lee las unidades ya incluidas
    }
    DETALLES_DATA = []
    this.dataSource2.paginator = this.allPaginator;
    let username = localStorage.getItem('username');//Se lee el username para el servicio
    this.devolucionService.getDevoluciones(username!)
      .subscribe(resp => {
        DETALLES_DATA = resp.respuesta;
        COMPONENTES_DATA = resp.stockTecnico;
        this.dataSource! = new MatTableDataSource<DetallesDelv>(DETALLES_DATA);
        this.dataSource.paginator! = this.paginator;
        resp.pendientes.forEach((_element: any) => {
          _element.forEach((_element2: any) => {
            this.pendientes.unshift(_element2);
          })
        });
        this.mostrar = this.comprobarTablaVacia(); //No mostrar las tablas
        DETALLES_DATA.forEach(detallesPropiedades => {
          if (detallesPropiedades.Bloqueado != 0) { //Por cambios en las devoluciones se le agrega estado a cada tipo de componente
            detallesPropiedades.estado = 'AVERIADO'
          } else if (detallesPropiedades.CtrlCalidad != 0) {
            detallesPropiedades.estado = 'CONTROL'
          } else if (detallesPropiedades.Disponible != 0) {
            detallesPropiedades.estado = 'DISPONIBLE'
          }
        })
        if (sessionStorage.getItem('ultDelivery')) {
          this.selectedDel(sessionStorage.getItem('ultDelivery')!)
        }
      })
  }


  comprobarTablaVacia() {
    if (this.pendientes.length === 0) {
      return false;
    }
    return true;
  }

  //Logica completa de la tabla 
  selectedDel(delSelected: string | number) {
    this.accesoAlb = false;
    sessionStorage.setItem('ultDelivery', `${delSelected}`)
    this.devolucionSeleccionada = delSelected;

    COMPONENTES = [];
    //Recorre los vectores de objetos, toma y compara las respectivas propiedades
    let index = 0;
    DETALLES_DATA.forEach(detallesPropiedades => {
      if (detallesPropiedades.delivery === delSelected) {
        detallesPropiedades.seleccionado = true;
        index++;
        this.componentesFor(detallesPropiedades)
      } else {
        detallesPropiedades.seleccionado = false;
      }
    })
    this.dataSource2.data = COMPONENTES;
    this.dataSource2.paginator = this.allPaginator;
    if (COMPONENTES.length !== index) {
      this.mostrarAlerta = true
    } else {
      this.mostrarAlerta = false
    }
  }

  componentesFor(detallesPropiedades: DetallesDelv) {
    COMPONENTES_DATA.filter(componentesPropiedades => {
      if (this.validator) {
        if (UNIDADES_INFO3.some(e => e.componente === componentesPropiedades.componente && e.delivery === this.devolucionSeleccionada)) {
          componentesPropiedades.seleccionado = true; //Seguir aca
          this.accesoAlb = true
        } else {
          componentesPropiedades.seleccionado = false;
        }
      }

      if (componentesPropiedades.componente === detallesPropiedades.componente) {
        //Filtro de componentes
        componentesPropiedades.estado = detallesPropiedades.estado
        COMPONENTES.push(componentesPropiedades)
      };
    })
  }
  setUnidades(nombreCompo: string) {
    DETALLES_DATA.forEach(e => {
      if (e.componente === nombreCompo && e.delivery === this.devolucionSeleccionada) {
        return localStorage.setItem('unidadesSolicitadas', `${e.unidadesSolicitadas}`)
      }
    })
  }
  reIniciar() {
    const dialogRef = this.dialog.open(DialogoAceptarComponent, { //Boton por si surgen problemas
      panelClass: 'custom-modalbox'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        let username = localStorage.getItem('username');
        this.devolucionService.limpiarTMP(username!).subscribe(resp => resp);
        sessionStorage.removeItem('unidadesIncluidas');
        sessionStorage.removeItem('ultDelivery')
        location.reload();
      }
    });
  }

  grabarDelSelected() { //Para usar mas adelante en el proceso
    sessionStorage.setItem('ultDelivery', `${this.devolucionSeleccionada}`);
  }
}



// Interfaces de las tablas

export interface DetallesDelv {
  delivery: number | string;
  componente: string;
  Descripcion: string;
  unidadesSolicitadas: number;
  Disponible: number;
  CtrlCalidad: number;
  Bloqueado: number;
  estado: string;
  seleccionado: boolean;
}

let DETALLES_DATA: DetallesDelv[] = [{
  delivery: "0", componente: '', Descripcion: '', unidadesSolicitadas: 0, seleccionado: false, Disponible: 0,
  CtrlCalidad: 0, Bloqueado: 0, estado: ''
},];

export interface ComponentesStock {
  delivery: number | string;
  componente: string;
  position: number;
  descripcion: string;
  unidades: number;
  seleccionado: boolean;
  estado: string;
}

let COMPONENTES_DATA: ComponentesStock[] = [];

let COMPONENTES: ComponentesStock[] = [

];
let UNIDADES_INFO3: DetallesDelv[] = [];
