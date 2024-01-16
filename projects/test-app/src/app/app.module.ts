import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ReactiveValidationModule } from '../../../angular-reactive-validation/src/lib/reactive-validation.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    ReactiveValidationModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
