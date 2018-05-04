import { Component, ContentChildren, QueryList, Input, ViewEncapsulation, AfterContentInit,
  OnDestroy, Optional, OnInit, Inject } from '@angular/core';
import { FormControl, ControlContainer, FormGroup } from '@angular/forms';
import { ValidationMessageComponent } from '../validation-message/validation-message.component';
import { ValidationError } from '../validation-error';
import { Subscription } from 'rxjs/Subscription';
import { getFormControlFromContainer } from '../get-form-control-from-container';
import { getControlPath } from '../get-control-path';
import { ObservableContainer } from '../observable-container';
import { executeAfterContentInit } from '../execute-after-content-init';
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
export class ValidationMessagesComponent implements OnInit, AfterContentInit, OnDestroy {
  private _for: FormControl[] = [];
  private messageComponentChangesContainer: ObservableContainer<QueryList<ValidationMessageComponent>> =
    new ObservableContainer(() => this.validateChildren());
  private controlStatusChangesContainer: ObservableContainer<FormControl> =
    new ObservableContainer(executeAfterContentInit(item => this.handleControlStatusChange(item), this));

  private formSubmitted = false;
  private formSubmittedSubscription: Subscription;

  constructor(@Optional() private controlContainer: ControlContainer, @Optional() private formSubmitDirective: FormDirective,
    @Optional() @Inject(ReactiveValidationModuleConfigurationToken) private configuration: ReactiveValidationModuleConfiguration) { }

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
    this.controlStatusChangesContainer.unsubscribeAll();
    this.controlStatusChangesContainer.subscribe(this._for, control => control.statusChanges, true);
  }

  ngOnInit() {
    if (this.formSubmitDirective) {
      this.formSubmittedSubscription = this.formSubmitDirective.submitted.subscribe(() => {
        this.formSubmitted = true;
      });
    }
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
    return this._for.filter(control => this.configuration && this.configuration.displayValidationMessageWhen ?
      this.configuration.displayValidationMessageWhen(control, this.formSubmitDirective ? this.formSubmitted : undefined) :
      control.touched || this.formSubmitted
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
