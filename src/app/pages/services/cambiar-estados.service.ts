import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { CambiarEstados } from '../interfaces/interfaces';
import {catchError, map, of, tap} from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class CambiarEstadosService {

  private _baseUrl :string = environment.baseUrl;

  constructor(private http : HttpClient) { }

  getComponente(numSerie:string, zona_id:string ) {
    const url = `${this._baseUrl}/cambio-estados`;


    console.log(url);
    

    return this.http.get<CambiarEstados>(url, {
      params: {
        numSerie,
        zona_id
      }
    })
    .pipe(
      tap(resp => {
        console.log(resp)
      }),
      map(resp => resp),
      catchError (err => of(err.error.msg))
      )
  }

  cambioEstado(zona_id : string, numSerie: string, nuevoEstado:string, componente_id:string, usuario_id:string, usuarioSAP:string){
    const url = `${this._baseUrl}/cambio-estados/cambiarEstado`;
    const body = {zona_id, numSerie, nuevoEstado, componente_id, usuario_id, usuarioSAP}

    console.log(url)
    
    return this.http.post<CambiarEstados>(url, body, {
      
    })
    .pipe(
      tap(resp =>{
        console.log(resp)
      }),
      map(resp => resp),
      catchError (err => of(err.error.msg))
    )
  }

  empresaComponente(componente_id: string, nuevoEstado: string, numSerie: string, zona_id: string, usuario_id: string){
    const url = `${this._baseUrl}/cambio-estados/empresaComponente`;
    const body = {zona_id, numSerie, nuevoEstado, componente_id, usuario_id}


    return this.http.post<CambiarEstados>(url, body, {

    })
    .pipe(
      tap(resp => {
        console.log(resp)
      }),
      map(resp => resp),
      catchError(err => of(err.error.msg))
    )
  }


}