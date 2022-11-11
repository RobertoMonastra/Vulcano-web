import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Stock } from '../interfaces/interfaces';
import {catchError, map, of, tap} from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class DetalleStockService {

  private _baseUrl :string = environment.baseUrl;

  constructor(private http : HttpClient) { }

  

   consultaStockPorSerie(id : string, numSerie : string) {
    const url = `${this._baseUrl}/detalleStock`;


    console.log(url);
    

    return this.http.get<Stock>(url, {
      params: {
        id,
        numSerie
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

  consultaStockModulos(id : string){
    const url = `${this._baseUrl}/detalleStock/buscaModulos`;

    console.log(url)

    return this.http.get<Stock>(url, {
      params: {
        id,
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

  consultaStockComponentes(id : string){
    const url = `${this._baseUrl}/detalleStock/buscaComp`;

    console.log(url)

    return this.http.get<Stock>(url, {
      params: {
        id,
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
