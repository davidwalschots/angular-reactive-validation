import { TestBed, async } from '@angular/core/testing';
import { Validators as AngularValidators, ValidatorFn, ValidationErrors } from '@angular/forms';
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
      expect((<ValidationErrors>result).message).toBeUndefined(
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

  it(`add a message when the validation result is invalid`, () => {
    const expectedMessage = 'The FormControl has an invalid value.';
    const combinations = [{
      validatorFn: Validators.min(0, expectedMessage),
      control: new FormControl(-1)
    }, {
      validatorFn: Validators.max(0, expectedMessage),
      control: new FormControl(1)
    }, {
      validatorFn: Validators.minLength(2, expectedMessage),
      control: new FormControl('a')
    }, {
      validatorFn: Validators.maxLength(2, expectedMessage),
      control: new FormControl('abc')
    }, {
      validatorFn: Validators.pattern(/a/, expectedMessage),
      control: new FormControl('b')
    }, {
      validatorFn: Validators.required(expectedMessage),
      control: new FormControl(null)
    }, {
      validatorFn: Validators.requiredTrue(expectedMessage),
      control: new FormControl(false)
    }, {
      validatorFn: Validators.email(expectedMessage),
      control: new FormControl('davidwalschots@users@noreply.github.com')
    }];

    combinations.forEach(combination => {
      const result = combination.validatorFn(combination.control);
      expect(result).not.toBeNull();
      expect((<ValidationErrors>result)[Object.getOwnPropertyNames(result)[0]].message).toEqual(expectedMessage);
    });
  });

  it(`add a dynamic message when the validation result is invalid`, () => {
    const combinations = [{
      validatorFn: Validators.min(0, min => `The minimum value is: ${min}`),
      control: new FormControl(-1),
      expectedMessage: 'The minimum value is: 0'
    }, {
      validatorFn: Validators.max(0, max => `The maximum value is: ${max}`),
      control: new FormControl(1),
      expectedMessage: 'The maximum value is: 0'
    }, {
      validatorFn: Validators.minLength(2, minLength => `The minimum length is: ${minLength}`),
      control: new FormControl('a'),
      expectedMessage: 'The minimum length is: 2'
    }, {
      validatorFn: Validators.maxLength(2, maxLength => `The maximum length is: ${maxLength}`),
      control: new FormControl('abc'),
      expectedMessage: 'The maximum length is: 2'
    }];

    combinations.forEach(combination => {
      const result = combination.validatorFn(combination.control);
      expect(result).not.toBeNull();
      expect((<ValidationErrors>result)[Object.getOwnPropertyNames(result)[0]].message).toEqual(combination.expectedMessage);
    });
  });

  it(`get the validation value by calling the input function when specified`, () => {
    const combinations = [{
      validatorFn: Validators.min,
      fn: () => 100,
      control: new FormControl(101)
    }, {
      validatorFn: Validators.max,
      fn: () => 100,
      control: new FormControl(99)
    }, {
      validatorFn: Validators.minLength,
      fn: () => 3,
      control: new FormControl('abc')
    }, {
      validatorFn: Validators.maxLength,
      fn: () => 5,
      control: new FormControl('abcd')
    }];

    const patternValidator = {
      validatorFn: Validators.pattern,
      fn: () => /a/,
      control: new FormControl('a')
    };

    combinations.forEach(combination => {
      spyOn(combination, 'fn').and.callThrough();
      combination.validatorFn(combination.fn, 'test')(combination.control);
      expect(combination.fn).toHaveBeenCalled();
    });

    spyOn(patternValidator, 'fn').and.callThrough();
    patternValidator.validatorFn(patternValidator.fn, 'test')(patternValidator.control);
    expect(patternValidator.fn).toHaveBeenCalled();
  });
});
