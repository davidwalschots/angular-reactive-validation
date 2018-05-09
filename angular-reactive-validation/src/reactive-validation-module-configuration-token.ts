import { InjectionToken } from '@angular/core';

import { ReactiveValidationModuleConfiguration } from './reactive-validation-module-configuration';

export const ReactiveValidationModuleConfigurationToken =
  new InjectionToken<ReactiveValidationModuleConfiguration>('ReactiveValidationModuleConfiguration');
