import { TestBed } from '@angular/core/testing';

import { ReactiveValidationModule } from './reactive-validation.module';
import { REACTIVE_VALIDATION_MODULE_CONFIGURATION_TOKEN } from './reactive-validation-module-configuration-token';

describe(`ReactiveValidationModule`, () => {
  describe(`when not calling forRoot`, () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ ReactiveValidationModule ]
      });
    });

    it(`should not provide configuration`, () => {
      expect(() => TestBed.inject(REACTIVE_VALIDATION_MODULE_CONFIGURATION_TOKEN)).toThrowError(/No provider for/);
    });
  });

  describe(`when calling forRoot`, () => {
    let configuration: any;

    beforeEach(() => {
      configuration = { };
      TestBed.configureTestingModule({
          imports: [
            ReactiveValidationModule.forRoot(configuration)
          ]
      });
    });

    it(`should provide configuration`, () => {
      expect(TestBed.inject(REACTIVE_VALIDATION_MODULE_CONFIGURATION_TOKEN)).toEqual(configuration);
    });
  });
});
