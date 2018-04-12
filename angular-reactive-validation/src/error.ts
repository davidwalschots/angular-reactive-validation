import { FormControl, ValidationErrors } from '@angular/forms';

export interface Error {
  control: FormControl;
  key: string;
  errorObject: ValidationErrors;
}
