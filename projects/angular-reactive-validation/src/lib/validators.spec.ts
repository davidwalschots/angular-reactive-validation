import { Validators as AngularValidators, ValidationErrors } from '@angular/forms';
import { UntypedFormControl } from '@angular/forms';

import { Validators } from './validators';

describe('Validators', () => {
  it(`of the Angular framework don't contain a message property in the validation result`, () => {
    const invalidCombinations = [{
      validatorFn: AngularValidators.min(0),
      control: new UntypedFormControl(-1)
    }, {
      validatorFn: AngularValidators.max(0),
      control: new UntypedFormControl(1)
    }, {
      validatorFn: AngularValidators.minLength(2),
      control: new UntypedFormControl('a')
    }, {
      validatorFn: AngularValidators.maxLength(2),
      control: new UntypedFormControl('abc')
    }, {
      validatorFn: AngularValidators.pattern(/a/),
      control: new UntypedFormControl('b')
    }, {
      validatorFn: AngularValidators.required,
      control: new UntypedFormControl(null)
    }, {
      validatorFn: AngularValidators.requiredTrue,
      control: new UntypedFormControl(false)
    }, {
      validatorFn: AngularValidators.email,
      control: new UntypedFormControl('davidwalschots@users@noreply.github.com')
    }];

    invalidCombinations.forEach(combination => {
      const result = combination.validatorFn(combination.control);
      expect(result).not.toBeNull(
        `A validator deemed the control value '${combination.control.value}' to be valid. This shouldn't be the case`);
      expect((result as ValidationErrors)['message']).toBeUndefined(
        `The angular framework uses the 'message' property. This behaviour is overwritten by the library`);
    });
  });

  it(`give a validation result that is equal to the framework's validators`, () => {
    const combinations = [{
      libraryValidatorFn: Validators.nullValidator,
      nativeValidatorFn: AngularValidators.nullValidator,
      controls: [new UntypedFormControl(1)]
    }, {
      libraryValidatorFn: Validators.min(0, 'message'),
      nativeValidatorFn: AngularValidators.min(0),
      controls: [new UntypedFormControl(-1), new UntypedFormControl(1)]
    }, {
      libraryValidatorFn: Validators.max(0, 'message'),
      nativeValidatorFn: AngularValidators.max(0),
      controls: [new UntypedFormControl(1), new UntypedFormControl(-1)]
    }, {
      libraryValidatorFn: Validators.minLength(2, 'message'),
      nativeValidatorFn: AngularValidators.minLength(2),
      controls: [new UntypedFormControl('a'), new UntypedFormControl('ab')]
    }, {
      libraryValidatorFn: Validators.maxLength(2, 'message'),
      nativeValidatorFn: AngularValidators.maxLength(2),
      controls: [new UntypedFormControl('abc'), new UntypedFormControl('ab')]
    }, {
      libraryValidatorFn: Validators.pattern(/a/, 'message'),
      nativeValidatorFn: AngularValidators.pattern(/a/),
      controls: [new UntypedFormControl('b'), new UntypedFormControl('a')]
    }, {
      libraryValidatorFn: Validators.required('message'),
      nativeValidatorFn: AngularValidators.required,
      controls: [new UntypedFormControl(null), new UntypedFormControl(123)]
    }, {
      libraryValidatorFn: Validators.requiredTrue('message'),
      nativeValidatorFn: AngularValidators.requiredTrue,
      controls: [new UntypedFormControl(false), new UntypedFormControl(true)]
    }, {
      libraryValidatorFn: Validators.email('message'),
      nativeValidatorFn: AngularValidators.email,
      controls: [new UntypedFormControl('davidwalschots@users@noreply.github.com'), new UntypedFormControl('davidwalschots@users.noreply.github.com')]
    }];

    combinations.forEach(combination => {
      combination.controls.forEach(control => {
        const nativeResult = combination.nativeValidatorFn(control);
        let libraryResult = combination.libraryValidatorFn(control);

        // Below we perform operations to remove the message property, and replace an empty object
        // with true. This is not perfect for testing. But, the only way to work around Angular
        // sometimes using booleans and sometimes objects for specifying validation state.
        if (libraryResult) {
          for (const property in libraryResult) {
            if (libraryResult.hasOwnProperty(property)) {
              delete libraryResult[property].message;
              if (Object.getOwnPropertyNames(libraryResult[property]).length === 0) {
                libraryResult[property] = true;
              }
            }
          }
        }

        expect(libraryResult).toEqual(nativeResult);
      });
    });
  });
});
