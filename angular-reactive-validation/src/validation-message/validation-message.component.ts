import { Component, Input, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, ValidationErrors } from '@angular/forms';
import { Error } from '../error';

@Component({
  selector: 'arv-validation-message',
  templateUrl: './validation-message.component.html',
  encapsulation: ViewEncapsulation.None
})
/**
 * The ValidationMessageComponent lets the developer specify a custom visual style and custom error message
 * for edge-cases where the standard style or message capabilities do not suffice.
 */
export class ValidationMessageComponent {
  private _context: ValidationErrors;

  @Input()
  /**
   * The FormControl for which a custom validation message should be shown. This is only required when the parent
   * ValidationMessagesComponent has multiple FormControls specified.
   */
  for: FormControl | undefined;

  @Input()
  /**
   * The name of the returned validation object property for which the custom validation message should be shown.
   */
  key: string;

  @Input()
  /**
   * The ValidationErrors object that contains contextual information about the error, which can be used for
   * displaying, e.g. the minimum length within the error message.
   */
  set context(errors: ValidationErrors) {
    this._context = errors;
  }
  get context() {
    console.log(this._context);
    return this._context;
  }

  canHandle(error: Error) {
    return (!this.for || error.control === this.for) && error.key === this.key;
  }

  show(error: Error) {
    this.context = error.errorObject;
  }

  reset() {
    this.context = undefined;
  }
}
