import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AbstractControl, FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { catchError, map, Observable, of, tap } from 'rxjs';

import { environment } from 'src/environments/environment';
import { AuthResponse, Usuario } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  public emailPattern:string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  public passwordPattern= '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}';
  private _baseUrl:string = environment.baseUrl;
  private _usuario!: Usuario;

  constructor(private http: HttpClient) { }
  //Verificacion de campos
   camposIguales( campo1: string, campo2: string ) {

    return ( formGroup: AbstractControl ): ValidationErrors | null => {
      const pass1 = formGroup.get(campo1)?.value;
      const pass2 = formGroup.get(campo2)?.value;
      if ( pass1 !== pass2 ) {
        formGroup.get(campo2)?.setErrors({ noIguales: true });
        return { noIguales: true }
      } 
      formGroup.get(campo2)?.setErrors(null);
      return null
    }
  }



  login( id: string, password: string ) {
    //Ruta del backend apuntando al login
    const url  = `${this._baseUrl}/auth/login`;
    const body = { id, password };
    //Envia username y password al backend, en este se verificara si la salida es exitosa o no
    return this.http.post<AuthResponse>( url, body )
      .pipe(
        tap( resp => {
          if ( resp.ok ) {
            localStorage.setItem('token', resp.token! );
            if(resp.zonaNombre != localStorage.getItem('nombre')){
              sessionStorage.clear()
            }
            localStorage.setItem('nombre', resp.zonaNombre!);
            localStorage.setItem('usuarioSAP', resp.usuarioSAP!)
          }
        }),
        map( resp => resp.ok ),
        catchError( err => of(err.error.msg) )
      );
  }

  validarToken(): Observable<boolean> {

    const url = `${ this._baseUrl }/auth/renew`;
    const headers = new HttpHeaders()
      .set('x-token', localStorage.getItem('token') || '' );
    console.log("Here")
    return this.http.get<AuthResponse>( url, { headers } )
        .pipe(
          map( resp => {
            localStorage.setItem('token', resp.token! );
            return resp.ok;
          }),
          catchError( err => of(false) )
          );
  }

  //Servicio encargado de enviar el email
  sendChangeEmail(id:string, email:string){
    const url = `${ this._baseUrl }/auth/send`;

    const body = { id, email };
    //Envia email y nombre, el backend checkeara que exista el usuario en la db
    return this.http.post<AuthResponse>( url,  body )
      .pipe(
        tap( ok => {
          if ( ok ) {
            console.log('enviado de 10')
          }
        }),
        map( resp => resp.ok ),
        catchError( err => of(err.error.msg) )
      );
  }

  changePassword(id: string, newPassword:string){
    const url = `${ this._baseUrl }/auth/change-password`;

    const body = { id, newPassword };
    //Envia email y nombre, el backend checkeara que exista el usuario en la db
    return this.http.post<AuthResponse>( url,  body )
      .pipe(
        tap( ok => {
          if ( ok ) {

          }
        }),
        catchError( err => of(err.error.msg) )
      );
  }

}
