import { ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';

/**
 * @dynamic
 */
export class ValidatorDeclaration {
  /**
   * Wraps your own validator functions for use with the angular-reactive-validation library.
   * @param validatorFn A function you want to wrap which can validate a control.
   * @param resultKey The error key used for indicating an error result as returned from the ValidatorFn.
   * @param message The message to display when a validation error occurs. A function can also be passed to determine
   * the message at a later time.
   */
  static wrapNoArgumentValidator(validatorFn: ValidatorFn, resultKey: string):
    (message?: string | (() => string)) => ValidatorFn {
      return function(message?: string | (() => string)): ValidatorFn {
        return function(control: AbstractControl): ValidationErrors | null {
          return ValidatorDeclaration.validateAndSetMessageIfInvalid(control, () => validatorFn, resultKey, message);
        };
      };
  }

  /**
   * Wraps your own validator functions for use with the angular-reactive-validation library.
   * @param validatorFactoryFn A function which accepts a single argument and returns a ValidatorFn.
   * @param resultKey The error key used for indicating an error result as returned from the ValidatorFn.
   */
  static wrapSingleArgumentValidator<TInput>(validatorFactoryFn: ((arg1: TInput) => ValidatorFn), resultKey: string):
    (arg1: TInput | (() => TInput), message?: string | ((arg1: TInput) => string)) => ValidatorFn {

      return function (arg1: TInput | (() => TInput), message?: string | ((arg1: TInput) => string)): ValidatorFn {
        return function(control: AbstractControl): ValidationErrors | null {
          arg1 = ValidatorDeclaration.unwrapArgument(arg1);

          return ValidatorDeclaration.validateAndSetMessageIfInvalid(control, validatorFactoryFn, resultKey, message, arg1);
        };
      };
  }

  /**
   * Wraps your own validator functions for use with the angular-reactive-validation library.
   * @param validatorFactoryFn A function which accepts two arguments and returns a ValidatorFn.
   * @param resultKey The error key used for indicating an error result as returned from the ValidatorFn.
   */
  static wrapTwoArgumentValidator<TInput1, TInput2>(validatorFactoryFn: ((arg1: TInput1, arg2: TInput2) => ValidatorFn), resultKey: string):
    (arg1: TInput1 | (() => TInput1), arg2: TInput2 | (() => TInput2), message?: string | ((arg1: TInput1, arg2: TInput2) => string)) =>
    ValidatorFn {

      return function (arg1: TInput1 | (() => TInput1), arg2: TInput2 | (() => TInput2),
        message?: string | ((arg1: TInput1, arg2: TInput2) => string)): ValidatorFn {

          return function(control: AbstractControl): ValidationErrors | null {
            arg1 = ValidatorDeclaration.unwrapArgument(arg1);
            arg2 = ValidatorDeclaration.unwrapArgument(arg2);

            return ValidatorDeclaration.validateAndSetMessageIfInvalid(control, validatorFactoryFn, resultKey, message, arg1, arg2);
          };
      };
  }

  private static unwrapArgument<T>(arg: T | (() => T)): T {
    if (typeof arg === 'function') {
      arg = arg();
    }

    return arg;
  }

  private static validateAndSetMessageIfInvalid(control: AbstractControl,
    validatorFactoryFn: (...args: any[]) => ValidatorFn, resultKey: string,
    message?: string | ((...args: any[]) => string), ...args: any[]): ValidationErrors | null {

      const validationResult = ValidatorDeclaration.validate(control, validatorFactoryFn, ...args);
      ValidatorDeclaration.setMessageIfInvalid(control, resultKey, validationResult, message, ...args);

      return validationResult;
  }

  private static validate(control: AbstractControl, validatorFactoryFn: (...args: any[]) => ValidatorFn, ...args: any[]):
    ValidationErrors | null {

      const wrappedValidatorFn = validatorFactoryFn(...args);
      return wrappedValidatorFn(control);
  }

  private static setMessageIfInvalid(control: AbstractControl, resultKey: string,
    validationResult: ValidationErrors | null, message?: string | ((...args: any[]) => string), ...args: any[]) {
    if (message) {
      if (validationResult && validationResult[resultKey]) {
        if (typeof message === 'function') {
          message = message(...args);
        }

        // Not all validators set an object. Often they'll simply set a property to true.
        // Here, we replace any non-object (or array) to be an object on which we can set a message.
        if (!ValidatorDeclaration.isObject(validationResult[resultKey])) {
          validationResult[resultKey] = {};
        }

        validationResult[resultKey]['message'] = message;
      }
    }
  }

  private static isObject(arg: any) {
    return arg !== null && typeof arg === 'object' && !Array.isArray(arg);
  }
}
