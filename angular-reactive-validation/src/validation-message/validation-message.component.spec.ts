import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ValidationMessageComponent } from './validation-message.component';
import { ValidationError } from '../validation-error';
import { Component, ViewChild } from '@angular/core';

describe('ValidationMessageComponent', () => {
  function setupCanHandleTests(): { control: any, component: ValidationMessageComponent, error: ValidationError } {
    const control: any = {
      errors: {
        required: true
      }
    };

    return {
      control: control,
      component: new ValidationMessageComponent(undefined),
      error: ValidationError.fromFirstError(control)
    };
  }

  it(`canHandle returns true when the error key and component key are equal (without for)`, () => {
    const { control, component, error } = setupCanHandleTests();
    component.key = 'required';

    const result = component.canHandle(error);

    expect(result).toBe(true);
  });

  it(`canHandle returns true when the error key and component key are equal (with for)`, () => {
    const { control, component, error } = setupCanHandleTests();
    component.for = control;
    component.key = 'required';

    const result = component.canHandle(error);

    expect(result).toBe(true);
  });

  it(`canHandle returns false when the component 'for' doesn't equal the error's control`, () => {
    const { control, component, error } = setupCanHandleTests();
    component.for = <any>{};
    component.key = 'required';

    const result = component.canHandle(error);

    expect(result).toBe(false);
  });

  it(`canHandle returns false when the error key doesn't equal the component key`, () => {
    const { control, component, error } = setupCanHandleTests();
    component.key = 'minlength';

    const result = component.canHandle(error);

    expect(result).toBe(false);
  });

  function setupErrorMessageTests(): {
    fixture: ComponentFixture<TestHostComponent>,
    validationMessageComponent: ValidationMessageComponent
  } {
    TestBed.configureTestingModule({
      declarations: [ValidationMessageComponent, TestHostComponent]
    });

    const fixture: ComponentFixture<TestHostComponent> = TestBed.createComponent(TestHostComponent);
    return {
      fixture: fixture,
      validationMessageComponent: fixture.componentInstance.validationMessageComponent
    };
  }

  it(`show displays the error message`, () => {
    const { fixture, validationMessageComponent } = setupErrorMessageTests();
    const error = ValidationError.fromFirstError(TestHostComponent.getFormControl());

    validationMessageComponent.show(error);

    expect(fixture.nativeElement.querySelector('.message')).toBeFalsy();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.message')).not.toBeFalsy();
    expect(fixture.nativeElement.querySelector('.message').textContent)
      .toBe(`The message is shown. requiredLength: ${error.errorObject.requiredLength}`);
  });

  it(`reset hides the error message`, () => {
    const { fixture, validationMessageComponent } = setupErrorMessageTests();
    const error = ValidationError.fromFirstError(TestHostComponent.getFormControl());

    validationMessageComponent.show(error);
    validationMessageComponent.reset();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.message')).toBeFalsy();
  });

  it(`show sets the context to the error object`, () => {
    const { fixture, validationMessageComponent } = setupErrorMessageTests();
    const error = ValidationError.fromFirstError(TestHostComponent.getFormControl());

    validationMessageComponent.show(error);
    expect(validationMessageComponent.context).toEqual(error.errorObject);
  });
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
