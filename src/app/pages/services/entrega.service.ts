import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EntregaService {
  private _baseUrl:string = environment.baseUrl;

  constructor(private http: HttpClient) { }


  getEntregasPendientes(id: string) {
    //Ruta del backend apuntando al endpoint entrega
    const url  = `${this._baseUrl}/entrega`;

    return this.http.get<any>( url, {
      params: {
        id,
      }
    } )
      .pipe(
        tap( resp => {
          console.log(resp)
        }),
        map( resp => resp ),
        catchError( err => of(err.error.msg) )
      );
  }

  getEntregasInfo(albaran_id: number) {
    //Ruta del backend apuntando al endpoint entrega
    const url  = `${this._baseUrl}/entrega/obtenerInfo`;
    console.log(albaran_id)
    return this.http.get<any>( url, {
      params: {
        albaran_id,
      }
    } )
      .pipe(
        tap( resp => {
          console.log(resp)
        }),
        map( resp => resp ),
        catchError( err => of(err.error.msg) )
      );
  }

  postTransportista(delivery:string, id: string) {
    //Ruta del backend apuntando al endpoint entrega
    const url  = `${this._baseUrl}/entrega/darTransportista`;
    const body = {delivery,id}
    return this.http.post<any>( url,  body )
      .pipe(
        catchError( err => of(err.error.msg) )
      );
  }
  
}
