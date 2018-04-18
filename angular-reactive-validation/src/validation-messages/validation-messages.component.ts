import { Component, ContentChildren, QueryList, Input, ViewEncapsulation, AfterContentInit, OnDestroy, Optional } from '@angular/core';
import { FormControl, AbstractControl, ControlContainer, FormGroup } from '@angular/forms';
import { ValidationMessageComponent } from '../validation-message/validation-message.component';
import { Error } from '../error';
import { Subscription } from 'rxjs/Subscription';
import { getFormControlFromContainer } from '../get-form-control-from-container';

@Component({
  selector: 'arv-validation-messages',
  templateUrl: './validation-messages.component.html',
  styleUrls: ['./validation-messages.component.scss'],
  encapsulation: ViewEncapsulation.None
})
/**
 * The ValidationMessagesComponent shows validation messages for one to many FormControls. It either shows
 * messages specified within the reactive form model, or shows custom messages declared using the
 * ValidationMessageComponent.
 */
export class ValidationMessagesComponent implements AfterContentInit, OnDestroy {
  private _for: FormControl[] = [];
  private messageComponentChanges: Subscription;
  private controlStatusChanges: Subscription[] = [];

  constructor(@Optional() private controlContainer: ControlContainer) { }

  @ContentChildren(ValidationMessageComponent) private messageComponents: QueryList<ValidationMessageComponent>;

  @Input()
  set for(controls: FormControl | (FormControl|string)[] | string) {
    if (Array.isArray(controls)) {
      if (controls.length === 0) {
        throw new Error(`arv-validation-messages doesn't allow declaring an empty array as input to the 'for' attribute.`);
      }

      this._for = controls.map(control => {
        if (typeof control === 'string') {
          return getFormControlFromContainer(control, this.controlContainer);
        } else {
          return control;
        }
      });
    } else if (typeof controls === 'string') {
      this._for = [getFormControlFromContainer(controls, this.controlContainer)];
    } else {
      this._for = [controls];
    }

    this.validateChildren();
    this.subscribeToValidityChanges();
  }

  ngAfterContentInit() {
    this.validateChildren();

    this.messageComponentChanges = this.messageComponents.changes.subscribe(() => {
      this.validateChildren();
    });
  }

  ngOnDestroy() {
    this.messageComponentChanges.unsubscribe();
    this.controlStatusChanges.forEach(subscription => subscription.unsubscribe());
  }

  isValid(): boolean {
    return this._for.every(control => control.valid);
  }

  getErrorMessagesAndValidateCustomErrors(): string[] {
    const errors = this.getFirstErrorPerControl();
    this.validateCustomErrors(errors);
    return this.getErrorMessages(errors);
  }

  /**
   * Validates that the child ValidationMessageComponents declare what FormControl they specify a message for (when needed); and
   * that the declared FormControl is actually part of the parent ValidationMessagesComponent 'for' collection (when specified).
   */
  private validateChildren() {
    if (!this.messageComponents) {
      return;
    }

    this.messageComponents.forEach(component => {
      if (this._for.length > 1 && component.for === undefined) {
        throw new Error(`Specify the FormControl for which the arv-validation-message element with key '${component.key}' ` +
          `should show messages.`);
      }
      if (component.for && this._for.indexOf(<FormControl>component.for) === -1) {
        throw new Error(`A arv-validation-messages element with key '${component.key}' attempts to show messages ` +
          `for a FormControl that is not declared in the parent arv-validation-messages element.`);
      }
    });
  }

  private subscribeToValidityChanges() {
    this.controlStatusChanges.forEach(subscription => subscription.unsubscribe());
    this.controlStatusChanges.length = 0;

    this._for.forEach(control => {
      this.controlStatusChanges.push(control.statusChanges.subscribe(() => {
        this.messageComponents.filter(component => component.for === control || component.for === undefined)
          .forEach(component => component.reset());

        const error = this.getFirstError(control);
        if (!error || error.errorObject.message) {
          return;
        }

        const messageComponent = this.messageComponents.find(component => {
          return component.canHandle(error);
        });

        if (messageComponent) {
          messageComponent.show(error);
        }
      }));
    });
  }

  private getErrorMessages(errors: Error[]): string[] {
    return errors.filter(error => !!error.errorObject.message)
      .map(error => error.errorObject.message);
  }

  private validateCustomErrors(errors: Error[]) {
    errors = errors.filter(error => !error.errorObject.message);

    for (const error of errors) {
      const messageComponent = this.messageComponents.find(component => {
        return component.canHandle(error);
      });

      if (!messageComponent) {
        throw new Error(`There is no suitable arv-validation-message element to show the '${error.key}' ` +
          `error of '${this.getControlPath(error.control)}'`);
      }
    }
  }

  private getFirstErrorPerControl(): Error[] {
    return this._for.map(this.getFirstError).filter(value => value !== undefined);
  }

  private getFirstError(control: FormControl) {
    return control.errors ? {
        control: control,
        key: Object.keys(control.errors)[0],
        errorObject: control.errors[Object.keys(control.errors)[0]]
      } : undefined;
  }

  private getControlPath(control: AbstractControl): string {
    if (control.parent) {
      let path = this.getControlPath(control.parent);
      if (path) {
        path += '.';
      }
      return path + Object.keys(control.parent.controls).find(key => {
        return control.parent.controls[key] === control;
      });
    }

    return '';
  }
}
