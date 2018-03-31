import { Component, ContentChildren, QueryList, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'arv-validation-messages',
  templateUrl: './validation-messages.component.html'
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
}
