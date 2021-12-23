import { Validators as AngularValidators, ValidationErrors } from '@angular/forms';
import { FormControl } from '@angular/forms';

import { Validators } from './validators';

describe('Validators', () => {
  it(`of the Angular framework don't contain a message property in the validation result`, () => {
    const invalidCombinations = [{
      validatorFn: AngularValidators.min(0),
      control: new FormControl(-1)
    }, {
      validatorFn: AngularValidators.max(0),
      control: new FormControl(1)
    }, {
      validatorFn: AngularValidators.minLength(2),
      control: new FormControl('a')
    }, {
      validatorFn: AngularValidators.maxLength(2),
      control: new FormControl('abc')
    }, {
      validatorFn: AngularValidators.pattern(/a/),
      control: new FormControl('b')
    }, {
      validatorFn: AngularValidators.required,
      control: new FormControl(null)
    }, {
      validatorFn: AngularValidators.requiredTrue,
      control: new FormControl(false)
    }, {
      validatorFn: AngularValidators.email,
      control: new FormControl('davidwalschots@users@noreply.github.com')
    }];

    invalidCombinations.forEach(combination => {
      const result = combination.validatorFn(combination.control);
      expect(result).not.toBeNull(
        `A validator deemed the control value '${combination.control.value}' to be valid. This shouldn't be the case`);
      expect((result as ValidationErrors).message).toBeUndefined(
        `The angular framework uses the 'message' property. This behaviour is overwritten by the library`);
    });
  });

  it(`give a validation result that is equal to the framework's validators`, () => {
    const combinations = [{
      libraryValidatorFn: Validators.nullValidator,
      nativeValidatorFn: AngularValidators.nullValidator,
      controls: [new FormControl(1)]
    }, {
      libraryValidatorFn: Validators.min(0, 'message'),
      nativeValidatorFn: AngularValidators.min(0),
      controls: [new FormControl(-1), new FormControl(1)]
    }, {
      libraryValidatorFn: Validators.max(0, 'message'),
      nativeValidatorFn: AngularValidators.max(0),
      controls: [new FormControl(1), new FormControl(-1)]
    }, {
      libraryValidatorFn: Validators.minLength(2, 'message'),
      nativeValidatorFn: AngularValidators.minLength(2),
      controls: [new FormControl('a'), new FormControl('ab')]
    }, {
      libraryValidatorFn: Validators.maxLength(2, 'message'),
      nativeValidatorFn: AngularValidators.maxLength(2),
      controls: [new FormControl('abc'), new FormControl('ab')]
    }, {
      libraryValidatorFn: Validators.pattern(/a/, 'message'),
      nativeValidatorFn: AngularValidators.pattern(/a/),
      controls: [new FormControl('b'), new FormControl('a')]
    }, {
      libraryValidatorFn: Validators.required('message'),
      nativeValidatorFn: AngularValidators.required,
      controls: [new FormControl(null), new FormControl(123)]
    }, {
      libraryValidatorFn: Validators.requiredTrue('message'),
      nativeValidatorFn: AngularValidators.requiredTrue,
      controls: [new FormControl(false), new FormControl(true)]
    }, {
      libraryValidatorFn: Validators.email('message'),
      nativeValidatorFn: AngularValidators.email,
      controls: [new FormControl('davidwalschots@users@noreply.github.com'), new FormControl('davidwalschots@users.noreply.github.com')]
    }];

    combinations.forEach(combination => {
      combination.controls.forEach(control => {
        const nativeResult = combination.nativeValidatorFn(control);
        let libraryResult = combination.libraryValidatorFn(control);

        libraryResult = libraryResult;

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
