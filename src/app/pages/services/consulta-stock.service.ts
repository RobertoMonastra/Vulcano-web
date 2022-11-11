import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Stock } from '../interfaces/interfaces';
import {catchError, map, of, tap} from 'rxjs'


@Injectable({
  providedIn: 'root'
})
export class ConsultaStockService {
  
  private _baseUrl :string = environment.baseUrl;

  constructor(private http : HttpClient) { }

  

   consultaStock(id : string) {
    const url = `${this._baseUrl}/consulta-stock`;


    console.log(url);
    

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
