import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { OTs } from '../interfaces/interfaces';
import {catchError, map, of, tap} from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class ConsultaOtsService {

  private _baseUrl :string = environment.baseUrl;

  constructor(private http : HttpClient) { }

  getOTsPorId(id: string, ot_id: string) {
    const url = `${this._baseUrl}/consulta-ots`;
    console.log(url);
    return this.http.get<OTs>(url, {
      params: {
        id,
        ot_id
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

  getOTsPorRefCliente(id: string, refCliente: string) {
    const url = `${this._baseUrl}/consulta-ots`;
    console.log(url);
    return this.http.get<OTs>(url, {
      params: {
        id,
        refCliente
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

  getOTsPorTerminal(id: string, nroTerminal: string){
    const url = `${this._baseUrl}/consulta-ots`;
    console.log(url);
    return this.http.get<OTs>(url, {
      params: {
        id,
        nroTerminal
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

  getOtsPorEstado(id:string, selectedEstado:string){
    const url = `${this._baseUrl}/consulta-ots`;
    console.log(url);
    return this.http.get<OTs>(url, {
      params: {
        id,
        selectedEstado
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

  getOtsPorEstadoCerrado(id:string, selectedEstado:string, selectedCliente:string, inicioFC:string, finalFC:string){
    const url = `${this._baseUrl}/consulta-ots`;
    console.log(url);
    return this.http.get<OTs>(url, {
      params: {
        id,
        selectedEstado,
        selectedCliente,
        inicioFC,
        finalFC
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

  getOtsPorEstadoCerradoSinCliente(id:string, selectedEstado:string, inicioFC:string, finalFC:string){
    const url = `${this._baseUrl}/consulta-ots`;
    console.log(url);
    return this.http.get<OTs>(url, {
      params: {
        id,
        selectedEstado,
        inicioFC,
        finalFC
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

  getOtsPorCliente(id:string, selectedCliente:string){
    const url = `${this._baseUrl}/consulta-ots`;
    console.log(url);
    return this.http.get<OTs>(url, {
      params: {
        id,
        selectedCliente
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

  getOtsPorFechaAsignacion(id: string, inicioFA: string, finalFA: string){
    const url = `${this._baseUrl}/consulta-ots`;
    console.log(url);
    return this.http.get<OTs>(url, {
      params: {
        id,
        inicioFA,
        finalFA
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

  getOtsPorFechaCierre(id: string, inicioFC: string, finalFC: string){
    const url = `${this._baseUrl}/consulta-ots`;
    console.log(url);
    return this.http.get<OTs>(url, {
      params: {
        id,
        inicioFC,
        finalFC
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
}
