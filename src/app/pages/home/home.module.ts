import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { HomeRoutingModule } from './home-routing.module';
import { MaterialModule } from '../../material/material.module';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { AnunciosComponent } from './anuncios/anuncios.component';
import { HomeComponent } from './home/home.component';


@NgModule({
  declarations: [
    SidebarComponent,
    AnunciosComponent,
    HomeComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MaterialModule,
    FormsModule
  ],
  exports:[
    SidebarComponent,
    AnunciosComponent,

  ]
})
export class HomeModule { }
