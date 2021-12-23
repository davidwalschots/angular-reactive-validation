import { FormControl, ValidationErrors, ValidatorFn, AbstractControl } from '@angular/forms';

import { ValidatorDeclaration } from './validator-declaration';

describe('ValidatorDeclaration', () => {
  describe('wrappers add a message when invalid', () => {
    const message = 'message on error';
    const resultKey = 'resultKey';
    const wrappedValidatorFn = (control: AbstractControl) => {
      const obj: any = {};
      obj[resultKey] = true;
      return obj;
    };

    const expectHasMessage = (validatorFn: ValidatorFn) => {
      const formControl = new FormControl('');

      let result = validatorFn(formControl);

      expect(result).not.toBeNull();
      result = result as ValidationErrors;
      expect(result[resultKey].message).toEqual(message);
    };

    it(`wrapNoArgumentValidator`, () => {
      const validator = ValidatorDeclaration.wrapNoArgumentValidator(wrappedValidatorFn, resultKey);

      expectHasMessage(validator(message));
    });

    it(`wrapSingleArgumentValidator`, () => {
      const validator = ValidatorDeclaration.wrapSingleArgumentValidator((input: any) => wrappedValidatorFn, resultKey);

      expectHasMessage(validator(1, message));
    });

    it(`wrapTwoArgumentValidator`, () => {
      const validator = ValidatorDeclaration.wrapTwoArgumentValidator((input1: any, input2: any) => wrappedValidatorFn, resultKey);

      expectHasMessage(validator(1, 2, message));
    });
  });

  describe('wrappers add a dynamic message when invalid', () => {
    const message = 'message on error';
    const messageFn = () => message;
    const resultKey = 'resultKey';
    const wrappedValidatorFn = (control: AbstractControl) => {
      const obj: any = {};
      obj[resultKey] = true;
      return obj;
    };

    const expectHasMessage = (validatorFn: ValidatorFn) => {
      const formControl = new FormControl('');

      let result = validatorFn(formControl);

      expect(result).not.toBeNull();
      result = result as ValidationErrors;
      expect(result[resultKey].message).toEqual(message);
    };

    it(`wrapNoArgumentValidator`, () => {
      const validator = ValidatorDeclaration.wrapNoArgumentValidator(wrappedValidatorFn, resultKey);

      expectHasMessage(validator(messageFn));
    });

    it(`wrapSingleArgumentValidator`, () => {
      const validator = ValidatorDeclaration.wrapSingleArgumentValidator((input: any) => wrappedValidatorFn, resultKey);

      expectHasMessage(validator(1, messageFn));
    });

    it(`wrapTwoArgumentValidator`, () => {
      const validator = ValidatorDeclaration.wrapTwoArgumentValidator((input1: any, input2: any) => wrappedValidatorFn, resultKey);

      expectHasMessage(validator(1, 2, messageFn));
    });
  });

  describe('wrappers get the validation value by calling the input function when specified', () => {
    it(`wrapSingleArgumentValidator`, () => {
      const spyObj = {
        validatorFn: (input1: number) => (control: AbstractControl) => {
            expect(input1).toEqual(i);
            return {};
          }
      };

      spyOn(spyObj, 'validatorFn').and.callThrough();

      const validator = ValidatorDeclaration.wrapSingleArgumentValidator(spyObj.validatorFn, 'key');

      let i = 0;
      const validatorFn = validator(() => i);
      const formControl = new FormControl('');
      for (; i < 10; i++) {
        validatorFn(formControl);
      }

      expect(spyObj.validatorFn).toHaveBeenCalled();
    });

    it(`wrapTwoArgumentValidator`, () => {
      const spyObj = {
        validatorFn: (input1: number, input2: number) => (control: AbstractControl) => {
            expect(input1).toEqual(i);
            expect(input2).toEqual(j);
            return {};
          }
      };

      spyOn(spyObj, 'validatorFn').and.callThrough();

      const validator = ValidatorDeclaration.wrapTwoArgumentValidator(spyObj.validatorFn, 'key');

      let i = 0;
      let j = 10;
      const validatorFn = validator(() => i, () => j);
      const formControl = new FormControl('');
      for (; i < 10; i++, j++) {
        validatorFn(formControl);
      }

      expect(spyObj.validatorFn).toHaveBeenCalled();
    });
  });
});
