import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DevolucionResponse } from '../interfaces/interfaces';
import { catchError, map, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DevolucionService {
  private _baseUrl:string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getDevoluciones(id: string) {
    //Ruta del backend apuntando al login
    const url  = `${this._baseUrl}/devoluciones`;

    return this.http.get<DevolucionResponse>( url, {
      params: {
        id,
      }
    } )
      .pipe(
        tap( resp => {
        }),
        map( resp => resp ),
        catchError( err => of(err.error.msg) )
      );
  }
  
  getInformacionStock(nombreComp:string, id: string, estadoCompos:string){
    const url  = `${this._baseUrl}/devoluciones/stockTecnico/${nombreComp}`;

    return this.http.get<DevolucionResponse>( url, {
      params: {
        id,
        estadoCompos,
      }
    } )
      .pipe(
        tap( resp => {
        }),
        map( resp => resp ),
        catchError( err => of(err.error.msg) )
      );
  }
  getDatosZona(id:string){
    const url  = `${this._baseUrl}/devoluciones/datos/`;
    return this.http.get<DevolucionResponse>( url, {
      params: {
        id,
      }
    } )
      .pipe(
        tap( resp => {
        }),
        map( resp => resp ),
        catchError( err => of(err.error.msg) )
      );
  }
  cargarTMP(componentes: any, zona_id: string, delivery: string, tipoCompo:string, zonaSap:string, estado:string){
    const url  = `${this._baseUrl}/devoluciones/cargarTMP`;
    const body = {componentes, zona_id, delivery, tipoCompo, zonaSap, estado};
    return this.http.post<DevolucionResponse>( url,  body )
      .pipe(
        tap( resp => {
          console.log(resp)
        }),
        catchError( err => of(err.error) )
      );
  }

  limpiarTMP(id:string){
    const url  = `${this._baseUrl}/devoluciones/limpiarTMP`;

    return this.http.get<DevolucionResponse>( url, {
      params: {
        id,
      }
    } )
      .pipe(
        tap( resp => {
        }),
        map( resp => resp ),
        catchError( err => of(err.error.msg) )
      );
  }

  postAlbaran(zona_id: string, nBultos:number, delivery:string, totalUnidades:number){
    const url  = `${this._baseUrl}/devoluciones/generarDevolucion`;

    const body = { zona_id, nBultos, delivery, totalUnidades };

    return this.http.post<DevolucionResponse>( url,  body )
      .pipe(
        tap( ok => {
          if ( ok ) {

          }
        }),
        catchError( err => of(err.error.msg) )
      );
    }
  }
