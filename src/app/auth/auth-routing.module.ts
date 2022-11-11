import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlankpasswordComponent } from './blankpassword/blankpassword.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { ForgotComponent } from './forgot/forgot.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: 'logueo', component: LoginComponent },
      { path: 'olvido', component: ForgotComponent },
      { path: 'blank', component: BlankpasswordComponent },
      { path: 'change-password/:id', component: ChangepasswordComponent },
      { path: '**', redirectTo: 'logueo' },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
