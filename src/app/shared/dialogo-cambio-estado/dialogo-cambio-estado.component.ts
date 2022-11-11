import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialogo-cambio-estado',
  templateUrl: './dialogo-cambio-estado.component.html',
  styleUrls: ['./dialogo-cambio-estado.component.css']
})
export class DialogoCambioEstadoComponent implements OnInit {
  opcionElegida:boolean=false;
  constructor(public dialogRef: MatDialogRef<DialogoCambioEstadoComponent>,
             ) { }

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
