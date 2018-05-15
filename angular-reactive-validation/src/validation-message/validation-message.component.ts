import { Component, Input, ViewEncapsulation, Optional } from '@angular/core';
import { FormControl, ValidationErrors, ControlContainer } from '@angular/forms';

import { ValidationError } from '../validation-error';
import { getFormControlFromContainer } from '../get-form-control-from-container';

@Component({
  selector: 'arv-validation-message',
  templateUrl: './validation-message.component.html',
  encapsulation: ViewEncapsulation.None
})
/**
 * The ValidationMessageComponent lets the developer specify a custom visual style and custom error message
 * for edge-cases where the standard style or message capabilities do not suffice.
 *
 * TODO: Trigger revalidation by parent whenever [for] changes.
 */
export class ValidationMessageComponent {
  private _context: ValidationErrors | undefined;
  private _for: FormControl | undefined;

  constructor(@Optional() private controlContainer: ControlContainer) { }

  @Input()
  /**
   * The FormControl for which a custom validation message should be shown. This is only required when the parent
   * ValidationMessagesComponent has multiple FormControls specified.
   */
  set for(control: FormControl | string | undefined) {
    this._for = typeof control === 'string' ? getFormControlFromContainer(control, this.controlContainer) : control;
  }
  get for(): FormControl | string | undefined {
    return this._for;
  }

  @Input()
  /**
   * The name of the returned validation object property for which the custom validation message should be shown.
   */
  key: string | undefined;

  /**
   * The ValidationErrors object that contains contextual information about the error, which can be used for
   * displaying, e.g. the minimum length within the error message.
   */
  get context(): any {
    return this._context;
  }

  canHandle(error: ValidationError) {
    return (!this.for || error.control === this.for) && error.key === this.key;
  }

  show(error: ValidationError) {
    this._context = error.errorObject;
  }

  reset() {
    this._context = undefined;
  }
}
