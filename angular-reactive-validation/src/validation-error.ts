import { UntypedFormControl, ValidationErrors } from '@angular/forms';

export class ValidationError {
  control: UntypedFormControl;
  key: string;
  errorObject: ValidationErrors;

  constructor(control: UntypedFormControl, key: string, errorObject: ValidationErrors) {
    this.control = control;
    this.key = key;
    this.errorObject = errorObject;
  }

  static fromFirstError(control: UntypedFormControl): ValidationError | undefined {
    if (!control.errors) {
      return undefined;
    }

    return new ValidationError(control, Object.keys(control.errors)[0], control.errors[Object.keys(control.errors)[0]]);
  }

  hasMessage(): boolean {
    return !!this.getMessage();
  }

  getMessage() {
    return this.errorObject.message;
  }
}
