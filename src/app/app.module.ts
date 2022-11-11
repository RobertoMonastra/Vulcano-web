import { BrowserModule } from '@angular/platform-browser';
import {LOCALE_ID, NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoadingComponent } from './shared/loading/loading.component';
import { LoadingInterceptor } from './loading.interceptor';
import localeEsAr from '@angular/common/locales/es-AR';
import { registerLocaleData } from '@angular/common';





registerLocaleData(localeEsAr, 'es-Ar');

@NgModule({
  declarations: [
    AppComponent,
    LoadingComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [{
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
