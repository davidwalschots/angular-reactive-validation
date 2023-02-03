import { InjectionToken } from '@angular/core';

import { ReactiveValidationModuleConfiguration } from './reactive-validation-module-configuration';

export const REACTIVE_VALIDATION_MODULE_CONFIGURATION_TOKEN =
  new InjectionToken<ReactiveValidationModuleConfiguration>('ReactiveValidationModuleConfiguration');
