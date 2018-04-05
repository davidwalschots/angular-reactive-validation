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
    const errorMessages = [];
    this._for.forEach(control => {
      for (const error in control.errors) {
        if (control.errors.hasOwnProperty(error)) {
          const message = control.errors[error].message;
          if (message) {
            errorMessages.push(message);
          }
        }
      }
    });

    return errorMessages;
  }
}
