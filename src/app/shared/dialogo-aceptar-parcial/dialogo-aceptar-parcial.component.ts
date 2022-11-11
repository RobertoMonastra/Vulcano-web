import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialogo-aceptar-parcial',
  templateUrl: './dialogo-aceptar-parcial.component.html',
  styleUrls: ['./dialogo-aceptar-parcial.component.css']
})
export class DialogoAceptarParcialComponent implements OnInit {
  opcionElegida:boolean = false;
  constructor(public dialogRef: MatDialogRef<DialogoAceptarParcialComponent>,) { }

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
