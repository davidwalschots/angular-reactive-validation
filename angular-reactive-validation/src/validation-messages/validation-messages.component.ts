import { Component, ContentChildren, QueryList, Input, ViewEncapsulation } from '@angular/core';
import { FormControl, AbstractControl } from '@angular/forms';
import { ValidationMessageComponent } from '../validation-message/validation-message.component';
import { Error } from '../error';

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
 *
 * TODO: Implement checking if the messageComponents specify the FormControl for which they show messages
 * if the number of FormControls of this component is > 1.
 */
export class ValidationMessagesComponent {
  private _for: FormControl[] = [];

  @ContentChildren(ValidationMessageComponent) messageComponents: QueryList<ValidationMessageComponent>;

  @Input()
  set for(controls: FormControl | FormControl[]) {
    if (Array.isArray(controls)) {
      this._for = controls;
    } else {
      this._for = [controls];
    }
  }

  isValid(): boolean {
    return this._for.every(control => control.valid);
  }

  getErrorMessagesAndShowCustomErrors(): string[] {
    const errors = this.getFirstErrorPerControl();
    this.showCustomErrors(errors);
    return this.getErrorMessages(errors);
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
