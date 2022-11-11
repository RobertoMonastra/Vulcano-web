import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-dialogo-cancelar',
  templateUrl: './dialogo-cancelar.component.html',
  styleUrls: ['./dialogo-cancelar.component.css']
})
export class DialogoCancelarComponent implements OnInit {
  opcionElegida:boolean=false;
  constructor(public dialogRef: MatDialogRef<DialogoCancelarComponent>,
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
