import { Validators as AngularValidators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * Provides a set of validators used by form controls.
 *
 * Code comments have been copied from the Angular source code.
 *
 * @dynamic
 */
export class Validators {
  /**
   * No-op validator.
   */
  static nullValidator = AngularValidators.nullValidator;
  static composeAsync = AngularValidators.composeAsync;

  /**
   * Compose multiple validators into a single function that returns the union
   * of the individual error maps.
   */
  static compose(validators: null): null;
  /**
   * Compose multiple validators into a single function that returns the union
   * of the individual error maps.
   */
  static compose(validators: (ValidatorFn|null|undefined)[]): ValidatorFn|null;
  static compose(validators: (ValidatorFn|null|undefined)[]|null): ValidatorFn|null {
    return AngularValidators.compose(validators);
  }

  /**
   * Validator that requires controls to have a value greater than or equal to a number.
   * Note: when using this function without specifying a message, you have to declare an
   * arv-validation-message element in the HTML with a custom message.
   */
  static min(min: number): ValidatorFn;
  /**
   * Validator that requires controls to have a value greater than or equal to a number.
   */
  static min(min: number, message: string): ValidatorFn;
  /**
   * Validator that requires controls to have a value greater than or equal to a number.
   * Note: when using this function without specifying a message, you have to declare an
   * arv-validation-message element in the HTML with a custom message.
   */
  static min(min: () => number): ValidatorFn;
  /**
   * Validator that requires controls to have a value greater than or equal to a number.
   */
  static min(min: () => number, message: string): ValidatorFn;
  /**
   * Validator that requires controls to have a value greater than or equal to a number.
   */
  static min(min: number, messageFunc: ((min: number) => string)): ValidatorFn;
  /**
   * Validator that requires controls to have a value greater than or equal to a number.
   */
  static min(min: () => number, messageFunc: ((min: number) => string)): ValidatorFn;
  static min(min: number | (() => number), message?: string | ((min: number) => string)): ValidatorFn {
    return Validators.singleArgumentValidator(AngularValidators.min, 'min', min, message);
  }

  /**
   * Validator that requires controls to have a value less than or equal to a number.
   * Note: when using this function without specifying a message, you have to declare an
   * arv-validation-message element in the HTML with a custom message.
   */
  static max(max: number): ValidatorFn;
  /**
   * Validator that requires controls to have a value less than or equal to a number.
   */
  static max(max: number, message: string): ValidatorFn;
  /**
   * Validator that requires controls to have a value less than or equal to a number.
   * Note: when using this function without specifying a message, you have to declare an
   * arv-validation-message element in the HTML with a custom message.
   */
  static max(max: () => number): ValidatorFn;
  /**
   * Validator that requires controls to have a value less than or equal to a number.
   */
  static max(max: () => number, message: string): ValidatorFn;
  /**
   * Validator that requires controls to have a value less than or equal to a number.
   */
  static max(max: number, messageFunc: ((max: number) => string)): ValidatorFn;
  /**
   * Validator that requires controls to have a value less than or equal to a number.
   */
  static max(max: () => number, messageFunc: ((max: number) => string)): ValidatorFn;
  static max(max: number | (() => number), message?: string | ((max: number) => string)): ValidatorFn {
    return Validators.singleArgumentValidator(AngularValidators.max, 'max', max, message);
  }

  /**
   * Validator that requires controls to have a value of a minimum length.
   * Note: when using this function without specifying a message, you have to declare an
   * arv-validation-message element in the HTML with a custom message.
   */
  static minLength(minLength: number): ValidatorFn;
  /**
   * Validator that requires controls to have a value of a minimum length.
   */
  static minLength(minLength: number, message: string): ValidatorFn;
  /**
   * Validator that requires controls to have a value of a minimum length.
   * Note: when using this function without specifying a message, you have to declare an
   * arv-validation-message element in the HTML with a custom message.
   */
  static minLength(minLength: () => number): ValidatorFn;
  /**
   * Validator that requires controls to have a value of a minimum length.
   */
  static minLength(minLength: () => number, message: string): ValidatorFn;
  /**
   * Validator that requires controls to have a value of a minimum length.
   */
  static minLength(minLength: number, messageFunc: ((minLength: number) => string)): ValidatorFn;
  /**
   * Validator that requires controls to have a value of a minimum length.
   */
  static minLength(minLength: () => number, messageFunc: ((minLength: number) => string)): ValidatorFn;
  static minLength(minLength: number | (() => number), message?: string | ((minLength: number) => string)): ValidatorFn {
    return Validators.singleArgumentValidator(AngularValidators.minLength, 'minlength', minLength, message);
  }

  /**
   * Validator that requires controls to have a value of a maximum length.
   * Note: when using this function without specifying a message, you have to declare an
   * arv-validation-message element in the HTML with a custom message.
   */
  static maxLength(maxLength: number): ValidatorFn;
  /**
   * Validator that requires controls to have a value of a maximum length.
   */
  static maxLength(maxLength: number, message: string): ValidatorFn;
  /**
   * Validator that requires controls to have a value of a maximum length.
   * Note: when using this function without specifying a message, you have to declare an
   * arv-validation-message element in the HTML with a custom message.
   */
  static maxLength(maxLength: () => number): ValidatorFn;
  /**
   * Validator that requires controls to have a value of a maximum length.
   */
  static maxLength(maxLength: () => number, message: string): ValidatorFn;
  /**
   * Validator that requires controls to have a value of a maximum length.
   */
  static maxLength(maxLength: number, messageFunc: ((maxLength: number) => string)): ValidatorFn;
  /**
   * Validator that requires controls to have a value of a maximum length.
   */
  static maxLength(maxLength: () => number, messageFunc: ((maxLength: number) => string)): ValidatorFn;
  static maxLength(maxLength: number | (() => number), message?: string | ((maxLength: number) => string)): ValidatorFn {
    return Validators.singleArgumentValidator(AngularValidators.maxLength, 'maxlength', maxLength, message);
  }

  /**
   * Validator that requires a control to match a regex to its value.
   * Note: when using this function without specifying a message, you have to declare an
   * arv-validation-message element in the HTML with a custom message.
   */
  static pattern(pattern: string|RegExp): ValidatorFn;
  /**
   * Validator that requires a control to match a regex to its value.
   */
  static pattern(pattern: string|RegExp, message: string): ValidatorFn;
  /**
   * Validator that requires a control to match a regex to its value.
   * Note: when using this function without specifying a message, you have to declare an
   * arv-validation-message element in the HTML with a custom message.
   */
  static pattern(pattern: () => string|RegExp): ValidatorFn;
  /**
   * Validator that requires a control to match a regex to its value.
   */
  static pattern(pattern: () => string|RegExp, message: string): ValidatorFn;
  static pattern(pattern: (string|RegExp) | (() => string|RegExp), message?: string): ValidatorFn {
    return Validators.singleArgumentValidator(AngularValidators.pattern, 'pattern', pattern, message);
  }

  /**
   * Validator that requires controls to have a non-empty value.
   * Note: when using this function without specifying a message, you have to declare an
   * arv-validation-message element in the HTML with a custom message.
   */
  static required(): ValidatorFn;
  /**
   * Validator that requires controls to have a non-empty value.
   */
  static required(message: string): ValidatorFn;
  static required(message?: string): ValidatorFn {
    return Validators.zeroArgumentValidator(AngularValidators.required, 'required', message);
  }

  /**
   * Validator that requires control value to be true.
   * Note: when using this function without specifying a message, you have to declare an
   * arv-validation-message element in the HTML with a custom message.
   */
  static requiredTrue(): ValidatorFn;
  /**
   * Validator that requires control value to be true.
   */
  static requiredTrue(message: string): ValidatorFn;
  static requiredTrue(message?: string): ValidatorFn {
    return Validators.zeroArgumentValidator(AngularValidators.requiredTrue, 'required', message);
  }

  /**
   * Validator that performs email validation.
   * Note: when using this function without specifying a message, you have to declare an
   * arv-validation-message element in the HTML with a custom message.
   */
  static email(): ValidatorFn;
  /**
   * Validator that performs email validation.
   */
  static email(message: string): ValidatorFn;
  static email(message?: string): ValidatorFn {
    return Validators.zeroArgumentValidator(AngularValidators.email, 'email', message);
  }

  private static singleArgumentValidator<TInput>(validatorFunc: ((TInput) => ValidatorFn), resultKey: string,
    input: TInput | (() => TInput), message?: string | ((TInput) => string)): ValidatorFn {
      return function(c: AbstractControl): ValidationErrors | null {
        if (typeof input === 'function') {
          input = input();
        }

        const nativeValidator = validatorFunc(input);
        const result = nativeValidator(c);

        if (message) {
          if (result && result[resultKey]) {
            if (typeof message === 'function') {
              message = message(input);
            }

            result[resultKey]['message'] = message;
          }
        }

        return result;
      };
  }

  private static zeroArgumentValidator(validatorFunc: ValidatorFn, resultKey: string, message?: string) {
    return function(c: AbstractControl): ValidationErrors | null {
      const result = validatorFunc(c);

      if (message) {
        if (result && result[resultKey]) {
          // required, requiredTrue and email validators don't set an object, but set a boolean property.
          // When this happens, we replace the boolean with an object containing the message.
          if (typeof result[resultKey] === 'boolean') {
            result[resultKey] = { message: message };
          } else {
            result[resultKey]['message'] = message;
          }
        }
      }

      return result;
    };
  }
}
