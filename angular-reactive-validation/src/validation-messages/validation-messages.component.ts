import { Component, ContentChildren, QueryList, Input, ViewEncapsulation, AfterContentInit,
  OnDestroy, Optional, Inject } from '@angular/core';
import { FormControl, ControlContainer } from '@angular/forms';
import { Subscription } from 'rxjs';

import { ValidationMessageComponent } from '../validation-message/validation-message.component';
import { ValidationError } from '../validation-error';
import { getFormControlFromContainer } from '../get-form-control-from-container';
import { getControlPath } from 'angular-validation-support';
import { ObservableContainer } from 'angular-validation-support';
import { executeAfterContentInit } from 'angular-validation-support';
import { FormDirective } from '../form/form.directive';
import { ReactiveValidationModuleConfiguration } from '../reactive-validation-module-configuration';
import { ReactiveValidationModuleConfigurationToken } from '../reactive-validation-module-configuration-token';

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
export class ValidationMessagesComponent implements AfterContentInit, OnDestroy {
  private _for: FormControl[] = [];
  private messageComponentChangesContainer: ObservableContainer<QueryList<ValidationMessageComponent>> =
    new ObservableContainer(() => this.validateChildren());
  private controlStatusChangesContainer: ObservableContainer<FormControl> =
    new ObservableContainer(executeAfterContentInit(item => this.handleControlStatusChange(item), this));

  private formSubmitted: boolean | undefined = undefined;
  private formSubmittedSubscription: Subscription;

  constructor(@Optional() private controlContainer: ControlContainer, @Optional() formSubmitDirective: FormDirective,
    @Optional() @Inject(ReactiveValidationModuleConfigurationToken) private configuration: ReactiveValidationModuleConfiguration) {
      if (formSubmitDirective) {
        this.formSubmitted = false;
        this.formSubmittedSubscription = formSubmitDirective.submitted.subscribe(() => {
          this.formSubmitted = true;
        });
      }
    }

  @ContentChildren(ValidationMessageComponent) private messageComponents: QueryList<ValidationMessageComponent>;

  @Input()
  set for(controls: FormControl | (FormControl|string)[] | string) {
    if (!Array.isArray(controls)) {
      controls = controls !== undefined ? [controls] : [];
    }

    if (controls.length === 0) {
      throw new Error(`arv-validation-messages doesn't allow declaring an empty array as input to the 'for' attribute.`);
    }

    this._for = controls.map(control => typeof control === 'string' ?
      getFormControlFromContainer(control, this.controlContainer) : control);

    this.validateChildren();
    this.controlStatusChangesContainer.unsubscribeAll();
    this.controlStatusChangesContainer.subscribe(this._for, control => control.statusChanges, true);
  }

  ngAfterContentInit() {
    this.messageComponentChangesContainer.subscribe(this.messageComponents, queryList => queryList.changes, true);
  }

  ngOnDestroy() {
    this.messageComponentChangesContainer.unsubscribeAll();
    this.controlStatusChangesContainer.unsubscribeAll();
    if (this.formSubmittedSubscription) {
      this.formSubmittedSubscription.unsubscribe();
    }
  }

  isValid(): boolean {
    return this.getFirstErrorPerControl().length === 0;
  }

  getErrorMessages(): string[] {
    return this.getFirstErrorPerControl().filter(error => error.hasMessage())
      .map(error => error.getMessage());
  }

  private getFirstErrorPerControl() {
    return <ValidationError[]>this._for.filter(control => this.configuration && this.configuration.displayValidationMessageWhen ?
      this.configuration.displayValidationMessageWhen(control, this.formSubmitted) : control.touched || this.formSubmitted
    ).map(ValidationError.fromFirstError).filter(value => value !== undefined);
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

  private handleControlStatusChange(control: FormControl) {
    this.messageComponents.filter(component => component.for === control || component.for === undefined)
      .forEach(component => component.reset());

    const error = ValidationError.fromFirstError(control);
    if (!error || error.hasMessage()) {
      return;
    }

    const messageComponent = this.messageComponents.find(component => {
      return component.canHandle(error);
    });

    if (messageComponent) {
      messageComponent.show(error);
    } else {
      throw new Error(`There is no suitable arv-validation-message element to show the '${error.key}' ` +
        `error of '${getControlPath(error.control)}'`);
    }
  }
}
