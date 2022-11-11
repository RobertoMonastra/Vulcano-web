import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorService } from '../services/validator.service';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css']
})
export class ForgotComponent implements OnInit {

  statusIcon: string = "email"

  loginForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(6)]],
    email: ['', [Validators.required, Validators.pattern(this.validatorService.emailPattern)]],
  });

  constructor(private fb: FormBuilder, private validatorService: ValidatorService,
    private snackBar: MatSnackBar,) { }

  ngOnInit(): void {
  }

  campoNoValido(campo: string) {
    return this.loginForm.get(campo)?.invalid
      && this.loginForm.get(campo)?.touched;
  }


  //Llamada al servicio encargado de conectarse con el backend
  sendEmail() {
    const { username, email } = this.loginForm.value;

    this.validatorService.sendChangeEmail(username, email)
      .subscribe(ok => {
        if (ok === true) {
          this.statusIcon = "done_outline"; //Cambia el icono
          this.loginForm.reset(); //Formatea los campos
          this.snackBar.open(`Email enviado, por revise su casilla de correos ✅`, 'Aceptar', { //SnakBar
            duration: 10000,
            panelClass: ["success-snackbar"], //Clases en el Style.css
          });
        } else {
          this.statusIcon = "close"
          this.snackBar.open(`El nombre de usuario es incorrecto`, 'Aceptar', {
            duration: 10000,
            panelClass: ["bad-snackbar"],
          });
        }
      })


  }
}
