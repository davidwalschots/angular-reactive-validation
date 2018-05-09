import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ValidationMessagesComponent } from './validation-messages/validation-messages.component';
import { ValidationMessageComponent } from './validation-message/validation-message.component';
import { FormDirective } from './form/form.directive';
import { ReactiveValidationModuleConfiguration } from './reactive-validation-module-configuration';
import { ReactiveValidationModuleConfigurationToken } from './reactive-validation-module-configuration-token';

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
  static forRoot(configuration?: ReactiveValidationModuleConfiguration): ModuleWithProviders {
    return {
      ngModule: ReactiveValidationModule,
      providers: [{
        provide: ReactiveValidationModuleConfigurationToken, useValue: configuration
      }]
    };
  }
}
