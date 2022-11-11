import { Component } from '@angular/core';
import { Router, Routes } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  showFiller: boolean = false;
  panelOpenState: boolean = false;
  username=localStorage.getItem('username');
  nombre = localStorage.getItem('nombre'); 

  constructor(private router:Router) { }

  logout(){
    
      localStorage.removeItem('username');
  
      localStorage.removeItem('password');
  
      this.router.navigateByUrl('/1212');
  
  }
  

  home(){
    
    this.router.navigateByUrl('/inicio');
  }
    
  

}
