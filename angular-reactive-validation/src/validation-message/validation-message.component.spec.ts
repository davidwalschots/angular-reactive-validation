import { Component, ViewChild } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { ValidationMessageComponent } from './validation-message.component';
import { ValidationError } from '../validation-error';
import { Validators } from '../validators';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

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

      component = new ValidationMessageComponent(undefined as any);
      error = ValidationError.fromFirstError(control) as ValidationError;
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
      component.for = {} as any;
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
      const error = ValidationError.fromFirstError(TestHostComponent.getFormControl()) as ValidationError;

      validationMessageComponent.show(error);

      expect(fixture.nativeElement.querySelector('.message')).toBeFalsy();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.message')).not.toBeFalsy();
      expect(fixture.nativeElement.querySelector('.message').textContent)
        .toEqual(`The message is shown. requiredLength: ${error.errorObject.requiredLength}`);
    });

    it(`are hidden by the reset function`, () => {
      const error = ValidationError.fromFirstError(TestHostComponent.getFormControl()) as ValidationError;

      validationMessageComponent.show(error);
      fixture.detectChanges();
      validationMessageComponent.reset();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.message')).toBeFalsy();
    });

    it(`and their context is set by the show function`, () => {
      const error = ValidationError.fromFirstError(TestHostComponent.getFormControl()) as ValidationError;

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
      @ViewChild(ValidationMessageComponent, {static: true}) validationMessageComponent: ValidationMessageComponent;

      static getFormControl(): any {
        return {
          errors: {
            minlength: { requiredLength: 10, actualLength: 5 }
          }
        };
      }
    }
  });

  it('can set control by name without exception being thrown due to ControlContainer not yet being initialized', () => {
    @Component({
      template: `
      <form [formGroup]="form">
        <arv-validation-message for="age" key="min">
        </arv-validation-message>
      </form>
      `
    })
    class TestHostComponent {
      @ViewChild(ValidationMessageComponent, { static: true }) validationMessageComponent: ValidationMessageComponent;

      age = new FormControl(0, [
        Validators.min(10, 'invalid age')
      ]);
      form = new FormGroup({
        age: this.age
      });
    }

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ValidationMessageComponent, TestHostComponent]
    });

    expect(() => {
      const fixture = TestBed.createComponent(TestHostComponent);
      fixture.detectChanges();
      expect(fixture.componentInstance.validationMessageComponent.for).toBe(fixture.componentInstance.age);
    }).not.toThrow();
  });
});
