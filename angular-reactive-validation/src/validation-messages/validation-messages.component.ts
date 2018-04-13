import { Component, ContentChildren, QueryList, Input, ViewEncapsulation, AfterContentInit, OnDestroy } from '@angular/core';
import { FormControl, AbstractControl } from '@angular/forms';
import { ValidationMessageComponent } from '../validation-message/validation-message.component';
import { Error } from '../error';
import { Subscription } from 'rxjs/Subscription';

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

  @ContentChildren(ValidationMessageComponent) private messageComponents: QueryList<ValidationMessageComponent>;

  @Input()
  set for(controls: FormControl | FormControl[]) {
    if (Array.isArray(controls)) {
      this._for = controls;
    } else {
      this._for = [controls];
    }

    this.validateChildren();
  }

  ngAfterContentInit() {
    this.validateChildren();

    this.messageComponentChanges = this.messageComponents.changes.subscribe(() => {
      this.validateChildren();
    });
  }

  ngOnDestroy() {
    this.messageComponentChanges.unsubscribe();
  }

  isValid(): boolean {
    return this._for.every(control => control.valid);
  }

  getErrorMessagesAndShowCustomErrors(): string[] {
    const errors = this.getFirstErrorPerControl();
    this.showCustomErrors(errors);
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
        throw new Error(`Specify the FormControl for which a ValidationMessageComponent with key '${component.key}' ` +
          `should show messages.`);
      }
      if (component.for && this._for.indexOf(component.for) === -1) {
        throw new Error(`A ValidationMessageComponent with key '${component.key}' attempts to show messages ` +
          `for a FormControl that is not declared in the parent ValidationMessagesComponent.`);
      }
    });
  }

  private getErrorMessages(errors: Error[]): string[] {
    return errors.filter(error => !!error.errorObject.message)
      .map(error => error.errorObject.message);
  }

  private showCustomErrors(errors: Error[]) {
    errors = errors.filter(error => !error.errorObject.message);

    this.messageComponents.forEach(component => {
      component.reset();
    });

    for (const error of errors) {
      const messageComponent = this.messageComponents.find(component => {
        return component.canHandle(error);
      });

      if (messageComponent) {
        messageComponent.show(error);
      } else {
        throw new Error(`There is no suitable ValidationMessageComponent to show the '${error.key}' ` +
          `error of '${this.getControlPath(error.control)}'`);
      }
    }
  }

  private getFirstErrorPerControl(): Error[] {
    return this._for.map(value => {
      if (value.errors) {
        return {
          control: value,
          key: Object.keys(value.errors)[0],
          errorObject: value.errors[Object.keys(value.errors)[0]]
        };
      } else {
        return undefined;
      }
    }).filter(value => value !== undefined);
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
