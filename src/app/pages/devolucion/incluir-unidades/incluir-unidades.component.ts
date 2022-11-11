import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogoAceptarComponent } from 'src/app/shared/dialogo-aceptar/dialogo-aceptar.component';
import { DevolucionService } from '../../services/devolucion.service';
import { QrScannerComponent } from 'src/app/shared/qr-scanner/qr-scanner.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExcelReaderComponent } from 'src/app/shared/excel-reader/excel-reader.component';

@Component({
  selector: 'app-incluir-unidades',
  templateUrl: './incluir-unidades.component.html',
  styleUrls: ['./incluir-unidades.component.css']
})
export class IncluirUnidadesComponent implements AfterViewInit {

  // Propiedades de la materialTable
  displayedColumns: string[] = ['position', 'COMPONENTE', 'DESCRIPCION', 'UNIDADES'];
  dataSource = new MatTableDataSource<UnidadesInfo>();
  hide: boolean = true;
  searched: string = "";
  componenteNom: string = ""
  componenteDesc: string = ""
  checkGeneral: boolean = false;
  cantRequerida: number = 0;
  contador: number = 0;
  desabilitarCheck: boolean = false;
  username: string = '';
  componenteSerializado: boolean = true;
  componentesError: string = '';
  cantidadNoSer: number = 0;
  deliverySel: string = '0';
  nmrCajaNoSer: number = 0;
  estadoComponentes: string = '';
  sinComponentes: boolean = true;
  toolbar: boolean = false;


  constructor(private router: Router, private activatedRoute: ActivatedRoute,
    private dialog: MatDialog, private devolucionService: DevolucionService,
    private snackBar: MatSnackBar,) { }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {
    this.deliverySel = sessionStorage.getItem('ultDelivery')!;
    this.cantRequerida = Number(localStorage.getItem('unidadesSolicitadas'));
    if (sessionStorage.getItem('unidadesIncluidas')) {
      UNIDADES_INFO2 = JSON.parse(sessionStorage.getItem('unidadesIncluidas')!);
    }
    //Extraccion del nombre del componente proveniente de la ruta
    this.activatedRoute.params
      .subscribe(
        (params: Params) => {
          this.componenteNom = params['componente'];
          this.componenteDesc = params['descripcion'];
          this.estadoComponentes = params['estado']
        }
      );
    this.username = localStorage.getItem('username')!;
    this.devolucionService.getInformacionStock(this.username, this.componenteNom, this.estadoComponentes)
      .subscribe(resp => {
        UNIDADES_INFO = resp.descUnidades;
        if (resp.Composerie == true) { //Pregunta si el componente tiene numero de serie
          this.componenteSerializado = true;
          if (resp.descUnidades.length == 0) {
            this.sinComponentes = false;
          }
        } else {
          this.componenteSerializado = false;
        }
        if (sessionStorage.getItem('unidadesIncluidas')) { /** Cambios 12/9/2022 Req mejoras devoluciones */
          UNIDADES_INFO.filter(componentesPropiedades => {
            UNIDADES_INFO2.filter(e => {
              if (e.numeroSerie === componentesPropiedades.numeroSerie && e.delivery === this.deliverySel) {
                componentesPropiedades.incluir = true;
                componentesPropiedades.numeroCaja = e.numeroCaja;
                this.cantRequerida = this.cantRequerida - 1;
              }
            })
          })
        }
        this.checkboxManager()
        this.dataSource = new MatTableDataSource<UnidadesInfo>(resp.descUnidades);
        this.dataSource.paginator! = this.paginator;
      })
    //Corroboracion de en que dispositivo se ingresa
    if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
      this.hide = true;
    } else {
      this.hide = false;
    }
  }

  //Suma y resta del contador de unidades requeridas
  reqContador(checked: boolean) {
    if (checked === true && this.cantRequerida > 0) {
      this.cantRequerida = this.cantRequerida - 1;
    } else if (checked === false) {
      this.cantRequerida = this.cantRequerida + 1;
    }
    this.checkboxManager()
  }

  //Funcion que habilita y deshabilita los checkboxes si el contador esta en 0
  checkboxManager() {
    UNIDADES_INFO.forEach(detallesPropiedades => {
      if (this.cantRequerida === 0) {
        if (detallesPropiedades.incluir === false || detallesPropiedades.incluir === undefined) {
          detallesPropiedades.deshabilitado = true;
        }
      } else {
        detallesPropiedades.deshabilitado = false;
      }
    });
  }
  // <--------->


  /*Checkbox que selecciona todos los demas, este depende del contador, 
  para no seleccionar cantidades absurdas*/
  selectAll() {
    UNIDADES_INFO.forEach(detalles => {
      if (this.checkGeneral == true && this.cantRequerida > 0) { //Recorre todo el arreglo, incluye los componentes hasta llegar a 0
        if (detalles.incluir == false || detalles.incluir == undefined) {
          detalles.incluir = true;
          this.cantRequerida = this.cantRequerida - 1;
        }
      } else if (this.checkGeneral == false) { //Recorre todo el arreglo,
        this.cantRequerida = Number.parseInt(localStorage.getItem('unidadesSolicitadas')!);
        detalles.incluir = false;
      }
    })
    //Al final de la funcion se llama a controlador de checkboxes para deshabilitarlos
    this.checkboxManager()
  }

  aceptar(): void {
    UNIDADES_INFO3 = []
    const dialogRef = this.dialog.open(DialogoAceptarComponent, {
      panelClass: 'custom-modalbox'
    });
    UNIDADES_INFO2 = UNIDADES_INFO2.filter((item) => item.componente != this.componenteNom || item.delivery != this.deliverySel)
    UNIDADES_INFO.forEach(detalles => {
      if (detalles.incluir) {
        detalles.componente = this.componenteNom;
        detalles.delivery = this.deliverySel;
        detalles.descripcion = this.componenteDesc;
        UNIDADES_INFO2.unshift(detalles);
        UNIDADES_INFO3.unshift(detalles);
      }
    })
    dialogRef.afterClosed().subscribe(result => { //Se graba el objeto en el sessionStorage
      if (result === true) {
        let username = localStorage.getItem('username')!;
        let zonaSap = localStorage.getItem('usuarioSAP')!;
        // if(localStorage.getItem('deliverySel')!.length > 100){
        this.snackBar.open(`La cantidad de componentes es muy grande, tenga paciencia y no desconecte el internet`, 'Aceptar', { //SnakBar
          duration: 10000,
          panelClass: ["success-snackbar"], //Clases en el Style.css
        });
        // }
        this.devolucionService.cargarTMP(UNIDADES_INFO3, username, this.deliverySel, 'serie', zonaSap, this.estadoComponentes)
          .subscribe(resp => {
            if (!resp.ok) {
              this.componentesError = resp.msg.replace(/,/g, ' ');
              this.componentesError = this.componentesError.replace(/-/g, "");

              this.snackBar.open(`${resp.error}`, 'Aceptar', { //SnakBar
                duration: 10000,
                panelClass: ["bad-snackbar"], //Clases en el Style.css
              });
            } else {
              sessionStorage.setItem('unidadesIncluidas', JSON.stringify(UNIDADES_INFO2));
              this.snackBar.open(`Componentes incluidos`, 'Aceptar', { //SnakBar
                duration: 1000,
                panelClass: ["success-snackbar"], //Clases en el Style.css
              });
              this.router.navigateByUrl('inicio/devoluciones')
            }
          })
      }
    });
  }
  /* Componentes no serializados */
  aceptarNoSerie(): void {
    const dialogRef = this.dialog.open(DialogoAceptarComponent, {
      panelClass: 'custom-modalbox'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) { //Si el usuario presiona "SI" graba los datos en el objeto
        let username = localStorage.getItem('username')!;
        let zonaSap = localStorage.getItem('usuarioSAP')!;
        UNIDADES_INFO2 = UNIDADES_INFO2.filter((item) => item.componente != this.componenteNom || item.delivery != this.deliverySel)
        let unidad = {
          "numeroSerie": this.cantidadNoSer,
          "averiado": false,
          "incluir": true,
          "componente": this.componenteNom,
          "delivery": this.deliverySel,
          "descripcion": this.componenteDesc,
          "numeroCaja": this.nmrCajaNoSer,
          "deshabilitado": false,
          "unidadesSolicitadas": this.cantidadNoSer,
        }
        let unidadBackend = {
          "numeroSerie": this.cantidadNoSer,
          "averiado": false,
          "incluir": true,
          "componente": this.componenteNom,
          "delivery": this.deliverySel,
          "descripcion": this.componenteDesc,
        }
        let arrayGenerico = [];
        arrayGenerico.push(unidadBackend)
        UNIDADES_INFO2.unshift(unidad);
        this.devolucionService.cargarTMP(arrayGenerico, username, this.deliverySel, 'noSeriado', zonaSap, this.estadoComponentes)
          .subscribe(resp => {
            if (!resp.ok) {
              this.componentesError = 'Error al incluir componentes no serieados';
              this.snackBar.open(`${resp.error}`, 'Aceptar', { //SnakBar
                duration: 10000,
                panelClass: ["bad-snackbar"], //Clases en el Style.css
              });
            } else {
              sessionStorage.setItem('unidadesIncluidas', JSON.stringify(UNIDADES_INFO2));
              this.snackBar.open(`Componentes incluidos`, 'Aceptar', { //SnakBar
                duration: 1000,
                panelClass: ["success-snackbar"], //Clases en el Style.css
              });
              this.router.navigateByUrl('inicio/devoluciones')
            }
          })
      }
    });
  }

  cancelar() {
    this.router.navigateByUrl('inicio/devoluciones');
  }

  botonQr() {
    const dialogRef = this.dialog.open(QrScannerComponent, {}); //Se abre el componente del boton QR
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        UNIDADES_INFO.forEach(e => {
          if (e.numeroSerie == result && this.cantRequerida >= 0) { //Si el dato escaneado y un numero de serie hacen match se añade
            e.incluir = true;
            this.cantRequerida = this.cantRequerida - 1;
            this.snackBar.open(`Componente incluido`, 'Aceptar', { //SnakBar
              duration: 10000,
              panelClass: ["success-snackbar"], //Clases en el Style.css
            });
          } else {
            this.snackBar.open(`No se encontro un componente con ese numero de serie`, 'Aceptar', { //SnakBar
              duration: 10000,
              panelClass: ["bad-snackbar"], //Clases en el Style.css
            });
          }
        })
      }
    });
  }
  searchBar() {
    let encontrado = false;
    let index = 0;
    for (const e of UNIDADES_INFO) {
      index++
      if (e.numeroSerie == this.searched) {
        if (e.incluir === true) {
          this.snackBar.open(`Componente ya incluido (Posicion: ${index})`, 'Aceptar', { //SnakBar
            duration: 1000,
            panelClass: ["bad-snackbar"], //Clases en el Style.css
          });
          encontrado = true;
          break;
        }
        if (this.cantRequerida >= 1) { //Si el dato buscado y un numero de serie hacen match se añade
          e.incluir = true;
          encontrado = true;
          this.cantRequerida = this.cantRequerida - 1;
          this.snackBar.open(`Componente incluido (Posicion: ${index})`, 'Aceptar', { //SnakBar
            duration: 1000,
            panelClass: ["success-snackbar"], //Clases en el Style.css
          });
          this.searched = '';
          break;
        }
      }
    }
    if (!encontrado) {
      this.snackBar.open(`No se encontro un componente con ese numero de serie`, 'Aceptar', { //SnakBar
        duration: 1000,
        panelClass: ["bad-snackbar"], //Clases en el Style.css
      });
    }
  }
  excelUpload() {
    const dialogRef = this.dialog.open(ExcelReaderComponent, {
      height: '65%',
      width: '60%'
    }); //Se abre el componente del boton QR
    dialogRef.afterClosed().subscribe(result => { //Logistica, listado y consultas, consultas
      if (result) {
        console.log(result[0])
        if (typeof result[0]['numeroSerie'] !== typeof '' || typeof result[0]['componente'] !== typeof '') {
          this.snackBar.open(`El archivo excel no es valido`, 'Aceptar', { //SnakBar
            duration: 3000,
            panelClass: ["bad-snackbar"], //Clases en el Style.css
          });
          return;
        }
        this.snackBar.open(`Excel leido exitosamente`, 'Aceptar', { //SnakBar
          duration: 5000,
          panelClass: ["success-snackbar"], //Clases en el Style.css
        });
        let index2 = 0;
        for (const obj of result) {
          index2++
          if(obj.componente === this.componenteNom){
            index2=index2 - 1;
            break
          }
        }
        let encontrado = 0;
        let cantidadReq = this.cantRequerida
        for(let index = 0; index < cantidadReq; index++) {
          const element = result[index2];
          index2++;
          for (const i of UNIDADES_INFO) {
            if (element.numeroSerie === i.numeroSerie) {
              if (i.incluir === true) {
                continue;
              }
              if (this.cantRequerida >= 1) { //Si el dato buscado y un numero de serie hacen match se añade
                i.incluir = true;
                encontrado++;
                this.cantRequerida = this.cantRequerida - 1;
              }else{
                break;
              }
            }
          }
        }
        if (encontrado !== 0) {
          this.snackBar.open(`Se encontraron ${encontrado} componentes del archivo`, 'Aceptar', { //SnakBar
            duration: 1000,
            panelClass: ["success-snackbar"], //Clases en el Style.css
          });
        }else{
          this.snackBar.open(`No se encontraron los componentes del archivo`, 'Aceptar', { //SnakBar
            duration: 10000,
            panelClass: ["bad-snackbar"], //Clases en el Style.css
          });
        }
      }
    });
  }
}



//<------------------ Interfaces de las tablas ---------------------->

interface UnidadesInfo {
  componente: string;
  descripcion: string;
  incluir: boolean;
  averiado: any;
  numeroSerie: any;
  numeroCaja: number;
  deshabilitado: boolean;
  unidadesSolicitadas: number;
  delivery: string;
}

let UNIDADES_INFO: UnidadesInfo[] = [];
let UNIDADES_INFO2: UnidadesInfo[] = [];
let UNIDADES_INFO3: UnidadesInfo[] = [];