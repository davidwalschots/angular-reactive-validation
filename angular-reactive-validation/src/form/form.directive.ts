import { Directive } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { Observable } from 'rxjs';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'form[formGroup]'
})
/**
 * Encapsulates properties and events of the form and makes them available for child components.
 */
export class FormDirective {
  /**
   * Observable which emits when the form is submitted.
   */
  submitted: Observable<any>;

  constructor(formGroupDirective: FormGroupDirective) {
    this.submitted = formGroupDirective.ngSubmit.asObservable();
  }
}
