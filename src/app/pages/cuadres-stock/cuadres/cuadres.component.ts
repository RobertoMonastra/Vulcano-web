import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CuadreMensualService } from '../../services/cuadre-mensual.service';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-cuadres',
  templateUrl: './cuadres.component.html',
  styleUrls: ['./cuadres.component.css']
})
export class CuadresComponent implements AfterViewInit {
  zona_id: string= localStorage.getItem('username')!;
  termino:string='';
  compoElegido:string='BUSCAR';
  nombreCompo:string='';
  textoError:string='';
  numSerIncluir:string='';
  cantIncluir:number=1;
  mascaraNumSerie:RegExp= /./;
  mascara:any;
  deshabilitar:boolean=true;
  Composeriado:number=0;
  checkGeneral:boolean=true;
  mostrar:boolean=true;

  myControl = new FormControl('BASE OPCIONAL');
  options: string[] = [];
  filteredOptions: Observable<string[]> | undefined;

  displayedColumns: string[] = ['COMPONENTE', 'EXISTENCIASVUL', 'EXISTENCIASALM'];
  displayedColumns2: string[] = ['ENSTOCK', 'COMPONENTE', 'NUMSERIE', 'DIASALMACEN'];
  displayedColumns3: string[] = ['QUITAR','COMPONENTE', 'NUMSERIE', 'CANTIDAD'];
  dataSource = new MatTableDataSource<UnidadesInfo>(UNIDADES_INFO);
  dataSource2 = new MatTableDataSource<UnidadesInfo2>(UNIDADES_INFO2);
  dataSource3 = new MatTableDataSource<UnidadesInfo3>(UNIDADES_INFO3);

  dataSource4 = new MatTableDataSource<UnidadesInfo4>(UNIDADES_INFO4);
  dataSource5 = new MatTableDataSource<UnidadesInfo2>(UNIDADES_INFO2);

  constructor(private cuadreService: CuadreMensualService) { }
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  @ViewChild('allPaginator', { read: MatPaginator }) allPaginator!: MatPaginator;//Segundo paginator
  @ViewChild('allPaginator3', { read: MatPaginator }) allPaginator3!: MatPaginator;//Tercer paginator
  @ViewChild('allPaginator4', { read: MatPaginator }) allPaginator4!: MatPaginator;//Cuarto paginator
  @ViewChild('allPaginator5', { read: MatPaginator }) allPaginator5!: MatPaginator;//Quinto paginator
  @ViewChild('allPaginator6', { read: MatPaginator }) allPaginator6!: MatPaginator;//Sexto paginator

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  ngAfterViewInit(): void {
    this.cuadreService.getStockSinSerie(this.zona_id).subscribe(resp => {
      UNIDADES_INFO = resp.stockNoSeriado
      this.dataSource.data = UNIDADES_INFO
    })
    this.dataSource.paginator = this.paginator;
    /** SEGUNDA TABLA */
    this.cuadreService.getStockSerie(this.zona_id).subscribe(resp => {
      UNIDADES_INFO2 = resp.stockSeriado
      UNIDADES_INFO2aux = resp.stockSeriado
      this.dataSource2.data = UNIDADES_INFO2
    })
    this.dataSource2.paginator = this.allPaginator;
    /** TERCERA PANTALLA */
    this.cuadreService.getMask().subscribe(resp => {
      this.mascara = resp.mask;
      for (const i of resp.mask) {
        this.options.push(i.componente_id);
      }
    })
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  selectAll(){
    if(this.checkGeneral == false){
      UNIDADES_INFO2.forEach(e => {
        e.incluir = false;
      })
    }else{
      UNIDADES_INFO2.forEach(e => {
        e.incluir = true;
      })
    }
  }

  search(){
    let aux = UNIDADES_INFO2aux;
    UNIDADES_INFO2 = aux.filter( (E) => 
        E.snmserie
          .includes(this.termino)
        )
    this.dataSource2.data = UNIDADES_INFO2
    this.dataSource2.paginator = this.allPaginator;
  }

  selectCompo(){
    this.deshabilitar=true
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
    }
  }
  incluirComponente(){
    let componente = {
      "componente_id": this.compoElegido,
      "snmserie": this.numSerIncluir,
      "cantidad": this.cantIncluir,
      "incluir": true,
    }
    let parar;
    UNIDADES_INFO3.forEach(e => {
      if(e.componente_id == componente.componente_id && e.snmserie == componente.snmserie ){
        parar = true;
        this.textoError = 'el componente ya esta incluido'
        return
      }
    });
    for (const i of UNIDADES_INFO2) {
      if(i.snmserie == componente.snmserie){
        parar = true;
        this.textoError = 'el componente ya esta en su stock';
        break;
      }
    }
    if(!parar){
      UNIDADES_INFO3.push(componente)
      this.dataSource3.data = UNIDADES_INFO3
      this.dataSource3.paginator = this.allPaginator3;

      this.numSerIncluir = '';
      this.cantIncluir = 1;
      this.textoError = '';
    }
  }

  eliminarComponente(componente:any){
    UNIDADES_INFO3.forEach((e, index) => {
      if(e == componente){
        e.incluir = false;
        UNIDADES_INFO3.splice(index, 1);
        this.textoError = '';
      }
    })
    setTimeout(() => {
      this.dataSource3.data = UNIDADES_INFO3
      this.dataSource3.paginator = this.allPaginator3;
    }, 200);
  }

  renderRows(a:any){
    if(a.selectedIndex != 3 || a.PointerEvent ){
      return
    }
    let arr = new Array;
    let arr2 = new Array;

    UNIDADES_INFO.forEach(e => {
      if(e.nexactuales !== e.nexactualesUsuario){
        arr.push(e)
      }
    });
    this.dataSource4.data = arr;
    this.dataSource4.paginator = this.allPaginator4;
    UNIDADES_INFO2.forEach(e => {
      if(e.incluir == false){
        arr2.push(e)
      }
    })
    this.dataSource5.data = arr2;
    this.dataSource5.paginator = this.allPaginator5;
    if(arr.length !== 0 || arr2.length !== 0 || UNIDADES_INFO3.length !== 0){
      this.mostrar = false
    }
  }

  processEnd(){
    this.cuadreService.postCuadre(this.zona_id,this.dataSource4.data ,this.dataSource5.data, this.dataSource3.data).subscribe(resp => {
      console.log(resp)
    })
  }
}

interface UnidadesInfo {
  componente_id:string;
  nexactuales:number;
  nexactualesUsuario: number;
}
interface UnidadesInfo4 {
  componente_id:string;
  nexactuales:number;
  nexactualesUsuario: number;
  diferencia:number;
}
interface UnidadesInfo2 {
  componente_id:string;
  snmserie: any;
  incluir: boolean;
  nDiasEnAlmacen: number;
}
interface UnidadesInfo3 {
  componente_id:string;
  snmserie: any;
  cantidad: number;
  incluir:boolean;
}
let UNIDADES_INFO: UnidadesInfo[] = [];
let UNIDADES_INFO2: UnidadesInfo2[] = [];
let UNIDADES_INFO2aux: UnidadesInfo2[] = [];
let UNIDADES_INFO3: UnidadesInfo3[] = [];
let UNIDADES_INFO4: UnidadesInfo4[] = [];