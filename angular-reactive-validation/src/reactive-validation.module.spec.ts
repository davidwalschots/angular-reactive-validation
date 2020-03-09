import { TestBed } from '@angular/core/testing';

import { ReactiveValidationModule } from './reactive-validation.module';
import { ReactiveValidationModuleConfigurationToken } from './reactive-validation-module-configuration-token';

describe(`ReactiveValidationModule`, () => {
  describe(`when not calling forRoot`, () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ ReactiveValidationModule ]
      });
    });

    it(`should not provide configuration`, () => {
      expect(() => TestBed.inject(ReactiveValidationModuleConfigurationToken)).toThrowError(/No provider for/);
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
      expect(TestBed.inject(ReactiveValidationModuleConfigurationToken)).toEqual(configuration);
    });
  });
});
