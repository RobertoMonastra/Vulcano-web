import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { HomeService } from '../../services/home.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { RequerimentRow } from '../../recepcion/recepcion/recepcion.component';
import { ThisReceiver } from '@angular/compiler';




@Component({
  selector: 'app-anuncios',
  templateUrl: './anuncios.component.html',
  styleUrls: ['./anuncios.component.css']
})
export class AnunciosComponent implements AfterViewInit {

  dataSource = new MatTableDataSource<RequerimentRow>();
  pendientesDel: Res[] = []
  pendientesRec: Res [] = []
  mostrarDel: boolean = true;
  mostrarRec: boolean = true;
  mostrar:boolean = true;

  constructor(private homeService: HomeService) { }
  @ViewChild(MatPaginator) paginator!: MatPaginator;

    ngAfterViewInit(): void {
    
    let username = localStorage.getItem('username')
    this.homeService.getAnuncios(username!)
    .subscribe(resp => {
      this.pendientesDel = resp.resDel;
      this.pendientesRec = resp.resRec;
      
      this.dataSource = new MatTableDataSource<RequerimentRow>(resp.respDevol)
      
      this.noHayDelPendientes();
      this.noHayRecPendientes();
      this.sinAnuncios();
    })
    this.dataSource.paginator! = this.paginator;
    
    
    }
    
    noHayDelPendientes(){

      if (this.pendientesDel.length !== 0){
        return this.mostrarDel = true;
      }else{
        return this.mostrarDel = false;
      }

    }

    noHayRecPendientes(){
      if (this.pendientesRec.length !== 0){
        return this.mostrarRec = true;
      }else{
        return this.mostrarRec = false;
      }
    }

    sinAnuncios(){
      if(!this.noHayDelPendientes()&&(!this.noHayRecPendientes())) {
        this.mostrar = true;

        }else{
          this.mostrar = false;
      }
    }


  }

  export interface DelRec {
    ok:     boolean;
    resDel: Res[];
    resRec: Res[];
  }

  export interface Res {
    DeliveryDocument: string;
  }

  
  




