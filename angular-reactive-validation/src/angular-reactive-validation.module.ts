import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidationMessagesComponent } from './validation-messages/validation-messages.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ValidationMessagesComponent
  ],
  exports: [
    ValidationMessagesComponent
  ]
})
export class AngularReactiveValidationModule {
}
