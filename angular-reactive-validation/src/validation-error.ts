import { FormControl, ValidationErrors } from '@angular/forms';

export class ValidationError {
  control: FormControl;
  key: string;
  errorObject: ValidationErrors;

  static fromFirstError(control: FormControl): ValidationError | undefined {
    if (!control.errors) {
      return undefined;
    }

    const error = new ValidationError();
    error.control = control;
    error.key = Object.keys(control.errors)[0];
    error.errorObject = control.errors[Object.keys(control.errors)[0]];

    return error;
  }

  hasMessage(): boolean {
    return !!this.getMessage();
  }

  getMessage() {
    return this.errorObject.message;
  }
}
