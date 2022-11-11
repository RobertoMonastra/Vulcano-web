import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { ValidatorService } from '../auth/services/validator.service';


@Injectable({
  providedIn: 'root'
})
export class TokenValidateGuard implements CanActivate, CanLoad {

  constructor(private validatorService: ValidatorService, private router:Router){}

  canActivate(): Observable<boolean> | boolean{
    return this.validatorService.validarToken()
      .pipe(
        tap( valid => {
          if(!valid){
            this.router.navigateByUrl('/iniciar-sesion');
          }
        })
      );
  }
  canLoad(): Observable<boolean> | boolean{
    return this.validatorService.validarToken()
      .pipe(
        tap( valid => {
          if(!valid){
            this.router.navigateByUrl('/iniciar-sesion');
          }
        })
      );
  }
}