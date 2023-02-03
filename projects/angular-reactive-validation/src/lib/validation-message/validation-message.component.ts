import { Component, Input, ViewEncapsulation, Optional, OnInit } from '@angular/core';
import { UntypedFormControl, ValidationErrors, ControlContainer } from '@angular/forms';

import { ValidationError } from '../validation-error';
import { getFormControlFromContainer, isControlContainerVoidOrInitialized } from '../get-form-control-from-container';

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
export class ValidationMessageComponent implements OnInit {

  @Input()
  /**
   * The FormControl for which a custom validation message should be shown. This is only required when the parent
   * ValidationMessagesComponent has multiple FormControls specified.
   */
  set for(control: UntypedFormControl | string | undefined) {
    if (!isControlContainerVoidOrInitialized(this.controlContainer)) {
      this.initializeForOnInit = () => this.for = control;
      return;
    }
    this._for = typeof control === 'string' ? getFormControlFromContainer(control, this.controlContainer) : control;
  }
  get for(): UntypedFormControl | string | undefined {
    return this._for;
  }

  @Input()
  /**
   * The name of the returned validation object property for which the custom validation message should be shown.
   */
  key: string | undefined;

  private _context: ValidationErrors | undefined;
  private _for: UntypedFormControl | undefined;

  constructor(@Optional() private controlContainer: ControlContainer) { }

  ngOnInit() {
    this.initializeForOnInit();
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

  private initializeForOnInit = () => {};

  /**
   * The ValidationErrors object that contains contextual information about the error, which can be used for
   * displaying, e.g. the minimum length within the error message.
   */
  get context(): any {
    return this._context;
  }
}
