import { Component, ViewChild } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { ValidationMessageComponent } from './validation-message.component';
import { ValidationError } from '../validation-error';

describe('ValidationMessageComponent', () => {
  describe('canHandle', () => {
    let control: any;
    let component: ValidationMessageComponent;
    let error: ValidationError;

    beforeEach(() => {
      control = {
        errors: {
          required: true
        }
      };

      component = new ValidationMessageComponent(<any>undefined);
      error = <ValidationError>ValidationError.fromFirstError(control);
    });

    it(`returns true when the error key and component key are equal (without for)`, () => {
      component.key = 'required';

      const result = component.canHandle(error);

      expect(result).toEqual(true);
    });

    it(`returns true when the error key and component key are equal (with for)`, () => {
      component.for = control;
      component.key = 'required';

      const result = component.canHandle(error);

      expect(result).toEqual(true);
    });

    it(`returns false when the component 'for' doesn't equal the error's control`, () => {
      component.for = <any>{};
      component.key = 'required';

      const result = component.canHandle(error);

      expect(result).toEqual(false);
    });

    it(`returns false when the error key doesn't equal the component key`, () => {
      component.key = 'minlength';

      const result = component.canHandle(error);

      expect(result).toEqual(false);
    });
  });

  describe('error messages', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let validationMessageComponent: ValidationMessageComponent;
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ValidationMessageComponent, TestHostComponent]
      });

      fixture = TestBed.createComponent(TestHostComponent);
      validationMessageComponent = fixture.componentInstance.validationMessageComponent;
    });

    it(`are displayed by the show function`, () => {
      const error = <ValidationError>ValidationError.fromFirstError(TestHostComponent.getFormControl());

      validationMessageComponent.show(error);

      expect(fixture.nativeElement.querySelector('.message')).toBeFalsy();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.message')).not.toBeFalsy();
      expect(fixture.nativeElement.querySelector('.message').textContent)
        .toEqual(`The message is shown. requiredLength: ${error.errorObject.requiredLength}`);
    });

    it(`are hidden by the reset function`, () => {
      const error = <ValidationError>ValidationError.fromFirstError(TestHostComponent.getFormControl());

      validationMessageComponent.show(error);
      fixture.detectChanges();
      validationMessageComponent.reset();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.message')).toBeFalsy();
    });

    it(`and their context is set by the show function`, () => {
      const error = <ValidationError>ValidationError.fromFirstError(TestHostComponent.getFormControl());

      validationMessageComponent.show(error);
      expect(validationMessageComponent.context).toEqual(error.errorObject);
    });

    @Component({
      template: `
      <arv-validation-message #minlengthValidation key="minlength">
        <p class="message">The message is shown. requiredLength: {{minlengthValidation.context?.requiredLength}}</p>
      </arv-validation-message>`
    })
    class TestHostComponent {
      @ViewChild(ValidationMessageComponent) validationMessageComponent: ValidationMessageComponent;

      static getFormControl(): any {
        return {
          errors: {
            minlength: { requiredLength: 10, actualLength: 5 }
          }
        };
      }
    }
  });
});
