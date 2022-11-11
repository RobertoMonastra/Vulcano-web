import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {
  showLoading: boolean = false;
  constructor(private loadingService: LoadingService, private cdRef: ChangeDetectorRef) {
  }
  
  ngOnInit(): void {
    this.init()
  }

  init(){
    this.loadingService.getSpinnerObserver().subscribe((status)=> { //Detecta cuando arranca la peticion Http
      this.showLoading = status === 'start'; //Muestra el loading
      this.cdRef.detectChanges(); 
    })
  }

}
