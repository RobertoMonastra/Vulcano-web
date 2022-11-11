import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialogo-aceptar',
  templateUrl: './dialogo-aceptar.component.html',
  styleUrls: ['./dialogo-aceptar.component.css']
})



export class DialogoAceptarComponent implements OnInit {
  opcionElegida:boolean = false;
  constructor(public dialogRef: MatDialogRef<DialogoAceptarComponent>,) { }

  ngOnInit(): void {
  }

  si(){
    this.opcionElegida = true;
    this.dialogRef.close(this.opcionElegida);
  }

  no(){
    this.opcionElegida = false;
    this.dialogRef.close(this.opcionElegida);
  }

  

}