import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidationMessagesComponent } from './validation-messages/validation-messages.component';
import { ValidationMessageComponent } from './validation-message/validation-message.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ValidationMessagesComponent,
    ValidationMessageComponent
  ],
  exports: [
    ValidationMessagesComponent,
    ValidationMessageComponent
  ]
})
export class AngularReactiveValidationModule {
}
