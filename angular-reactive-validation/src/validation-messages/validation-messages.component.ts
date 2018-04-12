import { Component, ContentChildren, QueryList, Input, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'arv-validation-messages',
  templateUrl: './validation-messages.component.html',
  styleUrls: ['./validation-messages.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ValidationMessagesComponent {
  private _for: FormControl[] = [];

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

  getErrorMessages(): string[] {
    const errors = this.getFirstErrorPerControl();
    const messages = [];
    errors.forEach(error => {
      if (error.errorObject.message) {
        messages.push(error.errorObject.message);
      } else {
        // Show message within ValidationMessageComponent.
      }
    });

    return messages;
  }

  private getFirstErrorPerControl() {
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
}
