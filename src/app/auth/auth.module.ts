import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { AuthRoutingModule } from './auth-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';

import { MaterialModule } from '../material/material.module';
import {LayoutModule} from '@angular/cdk/layout';

import { BlankpasswordComponent } from './blankpassword/blankpassword.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { ForgotComponent } from './forgot/forgot.component';

@NgModule({
  declarations: [
    BlankpasswordComponent,
    ChangepasswordComponent,
    ForgotComponent,
    LoginComponent,
    MainComponent,
  
  ],
  imports: [
    AuthRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule,
    MaterialModule
  ]
})
export class AuthModule { }
