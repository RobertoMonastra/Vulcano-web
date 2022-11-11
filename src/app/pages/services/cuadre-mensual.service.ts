import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class CuadreMensualService {

  private _baseUrl:string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getStockSinSerie(id: string) {
    //Ruta del backend apuntando al login
    const url  = `${this._baseUrl}/cuadre-mensual/stockNoSeriado`;

    return this.http.get<any>( url, {
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
  getStockSerie(id: string) {
    //Ruta del backend apuntando al login
    const url  = `${this._baseUrl}/cuadre-mensual/stockSeriado`;

    return this.http.get<any>( url, {
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
  getMask() {
    //Ruta del backend apuntando al login
    const url  = `${this._baseUrl}/cuadre-mensual/maskCompo`;

    return this.http.get<any>( url, {
      params: {
      }
    } )
      .pipe(
        tap( resp => {
        }),
        map( resp => resp ),
        catchError( err => of(err.error.msg) )
      );
  }
  postCuadre(zona_id:string, componentesNoSeriados: any, componentesEliminar: any, componentesAgregar: any){
    const url  = `${this._baseUrl}/cuadre-mensual/generarCuadre`;

    const body = { zona_id, componentesNoSeriados, componentesEliminar, componentesAgregar};

    return this.http.post<any>( url,  body )
      .pipe(
        tap( ok => {
          if ( ok ) {

          }
        }),
        catchError( err => of(err.error.msg) )
      );
  }
}
