import { Component, ContentChildren, QueryList, Input, ViewEncapsulation, AfterContentInit,
  OnDestroy, Optional, Inject, OnInit } from '@angular/core';
import { FormControl, ControlContainer } from '@angular/forms';
import { Subscription } from 'rxjs';

import { ValidationMessageComponent } from '../validation-message/validation-message.component';
import { ValidationError } from '../validation-error';
import { getFormControlFromContainer, isControlContainerVoidOrInitialized } from '../get-form-control-from-container';
import { FormDirective } from '../form/form.directive';
import { ReactiveValidationModuleConfiguration } from '../reactive-validation-module-configuration';
import { ReactiveValidationModuleConfigurationToken } from '../reactive-validation-module-configuration-token';
import { getControlPath } from '../get-control-path';

@Component({
  selector: 'arv-validation-messages',
  templateUrl: './validation-messages.component.html',
  encapsulation: ViewEncapsulation.None
})
/**
 * The ValidationMessagesComponent shows validation messages for one to many FormControls. It either shows
 * messages specified within the reactive form model, or shows custom messages declared using the
 * ValidationMessageComponent.
 */
export class ValidationMessagesComponent implements AfterContentInit, OnDestroy, OnInit {
  @ContentChildren(ValidationMessageComponent) private messageComponents: QueryList<ValidationMessageComponent>;

  private _for: FormControl[] = [];
  private messageComponentsChangesSubscription = new Subscription();
  private controlStatusChangesSubscription = new Subscription();

  private formSubmitted: boolean | undefined = undefined;
  private formSubmittedSubscription = new Subscription();

  constructor(@Optional() private controlContainer: ControlContainer, @Optional() formSubmitDirective: FormDirective,
    @Optional() @Inject(ReactiveValidationModuleConfigurationToken) private configuration: ReactiveValidationModuleConfiguration) {
      if (formSubmitDirective) {
        this.formSubmitted = false;
        this.formSubmittedSubscription.add(formSubmitDirective.submitted.subscribe(() => {
          this.formSubmitted = true;
        }));
      }
  }

  ngOnInit() {
    this.initializeForOnInit();
  }

  ngAfterContentInit() {
    this.messageComponentsChangesSubscription.add(this.messageComponents.changes.subscribe(this.validateChildren));
    this.validateChildren();

    this._for.forEach(control => {
      this.handleControlStatusChange(control);
    });
  }

  ngOnDestroy() {
    this.messageComponentsChangesSubscription.unsubscribe();
    this.formSubmittedSubscription.unsubscribe();
    this.controlStatusChangesSubscription.unsubscribe();
  }

  isValid(): boolean {
    return this.getFirstErrorPerControl().length === 0;
  }

  getErrorMessages(): string[] {
    return this.getFirstErrorPerControl().filter(error => error.hasMessage())
      .map(error => error.getMessage());
  }

  private initializeForOnInit = () => {};

  @Input()
  set for(controls: FormControl | (FormControl|string)[] | string) {
    if (!isControlContainerVoidOrInitialized(this.controlContainer)) {
      this.initializeForOnInit = () => this.for = controls;
      return;
    }

    if (!Array.isArray(controls)) {
      controls = controls !== undefined ? [controls] : [];
    }

    if (controls.length === 0) {
      throw new Error(`arv-validation-messages doesn't allow declaring an empty array as input to the 'for' attribute.`);
    }

    this._for = controls.map(control => typeof control === 'string' ?
      getFormControlFromContainer(control, this.controlContainer) : control);

    this.validateChildren();

    this.controlStatusChangesSubscription.unsubscribe();
    this.controlStatusChangesSubscription = new Subscription();
    this._for.forEach(control => {
      this.controlStatusChangesSubscription.add(control.statusChanges.subscribe(() => {
        this.handleControlStatusChange(control);
      }));
    });
  }



  private getFirstErrorPerControl() {
    return this._for.filter(control => this.configuration && this.configuration.displayValidationMessageWhen ?
      this.configuration.displayValidationMessageWhen(control, this.formSubmitted) : control.touched || this.formSubmitted
    ).map(ValidationError.fromFirstError).filter(value => value !== undefined) as ValidationError[];
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
      if (component.for && this._for.indexOf(component.for as FormControl) === -1) {
        throw new Error(`A arv-validation-messages element with key '${component.key}' attempts to show messages ` +
          `for a FormControl that is not declared in the parent arv-validation-messages element.`);
      }
    });
  }

  private handleControlStatusChange(control: FormControl) {
    if (!this.messageComponents) {
      return;
    }

    this.messageComponents.filter(component => component.for === control || component.for === undefined)
      .forEach(component => component.reset());

    const error = ValidationError.fromFirstError(control);
    if (!error || error.hasMessage()) {
      return;
    }

    const messageComponent = this.messageComponents.find(component => component.canHandle(error));

    if (messageComponent) {
      messageComponent.show(error);
    } else {
      throw new Error(`There is no suitable arv-validation-message element to show the '${error.key}' ` +
        `error of '${getControlPath(error.control)}'`);
    }
  }
}
