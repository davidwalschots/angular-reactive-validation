import { Directive } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'form[formGroup]'
})
/**
 * Encapsulates properties and events of the form and makes them available for child components.
 */
export class FormDirective {
  /**
   * Observable which emits when the form is submitted.
   */
  submitted: Observable<{}>;

  constructor(formGroupDirective: FormGroupDirective) {
    this.submitted = formGroupDirective.ngSubmit.asObservable();
  }
}
