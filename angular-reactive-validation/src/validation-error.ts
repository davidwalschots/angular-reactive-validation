import { FormControl, ValidationErrors } from '@angular/forms';

export class ValidationError {
  control: FormControl;
  key: string;
  errorObject: ValidationErrors;

  constructor(control: FormControl, key: string, errorObject: ValidationErrors) {
    this.control = control;
    this.key = key;
    this.errorObject = errorObject;
  }

  static fromFirstError(control: FormControl): ValidationError | undefined {
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
