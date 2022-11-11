import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorService } from '../services/validator.service';

@Component({
  selector: 'app-blankpassword',
  templateUrl: './blankpassword.component.html',
  styleUrls: ['./blankpassword.component.css']
})
export class BlankpasswordComponent implements OnInit {
  
loginForm: FormGroup = this.fb.group({
  oldPassword: ['', [ Validators.required, Validators.pattern(this.validatorService.passwordPattern) ]],
  newPassword: ['', [ Validators.required, Validators.pattern(this.validatorService.passwordPattern) ]],
  newPassword2: ['', [ Validators.required, Validators.pattern(this.validatorService.passwordPattern) ]],
},{
  validators: [this.validatorService.camposIguales('newPassword', 'newPassword2')]
});
constructor(private fb: FormBuilder, private validatorService: ValidatorService) { }

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

  login() {

    const { email, password } = this.loginForm.value;
  }


}
