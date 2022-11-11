import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { HomeResponse } from '../interfaces/interfaces';
import {catchError, map, of, tap} from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private _baseUrl :string = environment.baseUrl;

  constructor(private http : HttpClient) { }

  getAnuncios(id: string) {
    const url = `${this._baseUrl}/home`;


    console.log(url);
    

    return this.http.get<HomeResponse>(url, {
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
