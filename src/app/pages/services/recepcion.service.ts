import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { RecepcionResponse } from '../interfaces/interfaces';
import {catchError, map, of, tap} from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class RecepcionService {

  private _baseUrl :string = environment.baseUrl;

  constructor(private http : HttpClient) { }

  getRecepcion(id: string, cod:string, zona:string, DeliveryDocument: string, nroRemito:string) {
    const url = `${this._baseUrl}/home`;


    console.log(url);
    

    return this.http.get<RecepcionResponse>(url, {
      params: {
        id,
        cod,
        zona, 
        DeliveryDocument,
        nroRemito
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

  getRecepciones(id: string, cod:string, zona:string) {
    const url = `${this._baseUrl}/recepcion`;


    console.log(url);
    

    return this.http.get<RecepcionResponse>(url, {
      params: {
        id,
        cod,
        zona, 
        
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

  
  getCodDelivery(id:string, cod:string, zona:string, DeliveryDocument:string, nroRemito:string){
    const url = `${this._baseUrl}/codDelivery`;

    return this.http.get<RecepcionResponse>(url, {
      params: {
        id,
        cod,
        zona,
        DeliveryDocument,
        nroRemito
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

  postNroRemito(id:string, cod:string, DeliveryDocument:string, nroRemito: string){
    const url = `${this._baseUrl}/recepcion/acuseRemito`;
    const body = {id, cod, DeliveryDocument, nroRemito}
    return this.http.post<RecepcionResponse>(url, body, {
      
    })
    .pipe(
      tap(resp => {
        console.log(resp)
      }),
      map(resp => resp),
      catchError (err => of(err.error.msg))
    )
  }

  postAceptarNoConsumibles(id:string, sClaves:string, usuario_id: string, delegacion_id:string){
    const url = `${this._baseUrl}/codDelivery/aceptarNoConsumibles`;
    const body = {id, sClaves, usuario_id, delegacion_id}
    return this.http.post<RecepcionResponse>(url, body, {

    })
    .pipe(
      tap(resp => {
        console.log(resp)
      }),
      map(resp => resp),
      catchError (err => of(err.error))
    )
  }

  postAceptarConsumibles(id:string, sClaves:string, usuario_id: string, delegacion_id:string, sComponentesReceptados:string){
    const url = `${this._baseUrl}/codDelivery/aceptarConsumibles`;
    const body = {id, sClaves, usuario_id, delegacion_id, sComponentesReceptados}
    return this.http.post<RecepcionResponse>(url, body, {

    })
    .pipe(
      tap(resp =>{
        console.log(resp)
      }),
      map(resp=> resp),
      catchError(err => of (err.error))
    )
  }

}
