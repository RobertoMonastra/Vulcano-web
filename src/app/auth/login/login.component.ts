import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidatorService } from '../services/validator.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hide: boolean = true;
  loginForm: FormGroup = this.fb.group({
    id:   ['', [ Validators.required, Validators.minLength(6) ]],
    password:   ['', [ Validators.required, Validators.minLength(4), Validators.maxLength(20),/*Validators.pattern(this.validatorService.passwordPattern)*/ ]],
  });
  errorBackend: string = '';


  constructor(private fb: FormBuilder, private validatorService: ValidatorService,
              private router:Router,) { }

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
    }
    return '';
  }

  login() {
  
    const { id, password } = this.loginForm.value;
    this.validatorService.login( id, password )
      .subscribe( ok => {

        if ( ok === true ) {
          this.router.navigateByUrl('/inicio');
          localStorage.setItem('username', id);
          localStorage.setItem('password', password);
        } else {
          console.log('Error', ok, 'error');
          this.errorBackend = ok
        }
      });
  }

}
