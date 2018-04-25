import { Directive, OnInit } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'form[formGroup]'
})
/**
 * Encapsulates properties and events of the form and makes them available for child components.
 */
export class FormDirective implements OnInit {
  /**
   * Observable which emits when the form is submitted.
   */
  submitted: Observable<{}>;

  constructor(private formGroupDirective: FormGroupDirective) {
  }

  ngOnInit() {
    this.submitted = this.formGroupDirective.ngSubmit.asObservable();
  }
}
