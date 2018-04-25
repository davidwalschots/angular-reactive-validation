import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidationMessagesComponent } from './validation-messages/validation-messages.component';
import { ValidationMessageComponent } from './validation-message/validation-message.component';
import { FormDirective } from './form/form.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ValidationMessagesComponent,
    ValidationMessageComponent,
    FormDirective
  ],
  exports: [
    ValidationMessagesComponent,
    ValidationMessageComponent,
    FormDirective
  ]
})
export class ReactiveValidationModule {
}
