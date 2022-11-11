import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ValidatorService } from '../services/validator.service';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.css']
})
export class ChangepasswordComponent implements OnInit {
  loginForm: FormGroup = this.fb.group({
    newPassword: ['', [ Validators.required, Validators.minLength(8), Validators.maxLength(20),/*Validators.pattern(this.validatorService.passwordPattern) */]],
    newPassword2: ['', [ Validators.required, Validators.minLength(8), Validators.maxLength(20),/*Validators.pattern(this.validatorService.passwordPattern) */]],
  }
  ,{
    validators: [this.validatorService.camposIguales('newPassword', 'newPassword2')]
  });
  username: string = ''


  constructor(private fb: FormBuilder, private validatorService: ValidatorService,
            private activatedRoute: ActivatedRoute, private snackBar: MatSnackBar,
            private router:Router) { }

  ngOnInit(): void {
  }

  campoNoValido(campo: string ){
    return this.loginForm.get(campo)?.invalid
            && this.loginForm.get(campo)?.touched;

  }

  invalidPassword( campo: string ):string {
    if(this.loginForm.get(campo)?.errors?.['minlength']){
      return 'La contraseña debe tener al menos 4 digitos'
    } else if(this.loginForm.get(campo)?.errors?.['pattern']){
      return 'La contraseña debe tener al menos un numero y un caracter especial'
    } else if(this.loginForm.get(campo)?.errors?.['maxlength']){
      return 'La contraseña no debe tener mas de 20 digitos'
    } else if(this.loginForm.get(campo)?.errors?.['noIguales']){
      return 'Las contraseñas deben ser iguales'
    }
    return '';
  }

  changePassword() {
    this.activatedRoute.params
    .subscribe(
      (params: Params) => {
        this.username = params['id']
      }
    );
    const {newPassword2} = this.loginForm.value;
    
    this.validatorService.changePassword(this.username, newPassword2)
      .subscribe(resp => {
        if(resp.ok){
          this.snackBar.open(`${resp.msg} ✅`, 'Aceptar', {
            duration: 5000,
            panelClass: ["success-snackbar"],
          });
          this.router.navigateByUrl('/iniciar-sesion');
          
        }else{
          this.snackBar.open(resp.msg, 'Aceptar', {
            duration: 5000,
            panelClass: ["bad-snackbar"],
          });
        }
      })
    
    
  
  }
}
