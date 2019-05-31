import { Component } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ControlContainer, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';

import { ValidationMessagesComponent } from './validation-messages.component';
import { FormDirective } from '../form/form.directive';
import { ValidationMessageComponent } from '../validation-message/validation-message.component';
import { Validators } from '../validators';
import { ReactiveValidationModule } from '../reactive-validation.module';

describe('ValidationMessagesComponent', () => {
  describe('properties and functions', () => {
    let component: ValidationMessagesComponent;
    let formGroup: FormGroup;
    let firstNameControl: FormControl;
    let middleNameControl: FormControl;
    let lastNameControl: FormControl;

    beforeEach(() => {
      firstNameControl = new FormControl('', [
        Validators.required('A first name is required'),
        Validators.minLength(5, minLength => `First name needs to be at least ${minLength} characters long`)
      ]);
      middleNameControl = new FormControl('', [Validators.required('A middle name is required')]);
      lastNameControl = new FormControl('', [
        Validators.required('A last name is required'),
        Validators.minLength(5, minLength => `Last name needs to be at least ${minLength} characters long`)
      ]);
      formGroup = new FormGroup({
        firstName: firstNameControl,
        middleName: middleNameControl,
        lastName: lastNameControl
      });

      const controlContainer: any = {
        control: formGroup
      };

      TestBed.configureTestingModule({
        declarations: [ValidationMessagesComponent],
        providers: [
          { provide: ControlContainer, useValue: controlContainer }
        ]
      });

      component = TestBed.createComponent(ValidationMessagesComponent).componentInstance;
    });

    it(`for property doesn't accept an empty array`, () => {
      expect(() => component.for = [])
        .toThrowError(`arv-validation-messages doesn't allow declaring an empty array as input to the 'for' attribute.`);
    });

    it(`for property handles a single input string`, () => {
      expect(() => component.for = 'firstName').not.toThrow();
    });

    it(`for property handles a single input FormControl`, () => {
      expect(() => component.for = firstNameControl).not.toThrow();
    });

    it(`for property handles an array with strings and FormControls`, () => {
      expect(() => component.for = [firstNameControl, 'middleName', lastNameControl]).not.toThrow();
    });

    it(`isValid returns true when there are no controls with ValidationErrors and they are touched (default configuration)`, () => {
      component.for = firstNameControl;
      firstNameControl.setValue('firstName');
      firstNameControl.markAsTouched();

      expect(component.isValid()).toEqual(true);
    });

    it(`isValid returns false when there are controls with ValidationErrors and they are touched (default configuration)`, () => {
      component.for = [firstNameControl];
      firstNameControl.markAsTouched();

      expect(component.isValid()).toEqual(false);
    });

    it(`getErrorMessages returns the first error message per touched control (default configuration)`, () => {
      component.for = [firstNameControl, middleNameControl, lastNameControl];
      firstNameControl.markAsTouched();
      // We skip middleNameControl on purpose, to ensure that it doesn't return it's error.
      lastNameControl.markAsTouched();
      lastNameControl.setValue('abc');

      expect(component.getErrorMessages()).toEqual(['A first name is required', 'Last name needs to be at least 5 characters long']);
    });
  });

  describe('when in', () => {
    let fixture: ComponentFixture<TestHostComponent>;

    describe('the default configuration validation is shown when', () => {
      let submittedSubject: Subject<{}>;

      beforeEach(() => {
        submittedSubject = new Subject<{}>();
        TestBed.configureTestingModule({
          imports: [ReactiveFormsModule],
          declarations: [ValidationMessagesComponent, ValidationMessageComponent, TestHostComponent],
          providers: [{
            provide: FormDirective, useValue: {
              submitted: submittedSubject
            }
          }]
        });

        fixture = TestBed.createComponent(TestHostComponent);
        fixture.detectChanges();
      });

      it(`the associated control is touched`, () => {
        fixture.componentInstance.firstNameControl.markAsTouched();
        fixture.componentInstance.lastNameControl.markAsTouched();
        fixture.detectChanges();

        expectValidationIsShown();
      });

      it(`the form has been submitted`, () => {
        submittedSubject.next();
        fixture.detectChanges();

        expectValidationIsShown();
      });
    });

    describe('an alternative configuration', () => {
      const configuration = {
        displayValidationMessageWhen: () => true
      };

      beforeEach(() => {
        spyOn(configuration, 'displayValidationMessageWhen').and.callThrough();

        TestBed.configureTestingModule({
          imports: [ReactiveFormsModule, ReactiveValidationModule.forRoot(configuration)],
          declarations: [TestHostComponent],
        });

        fixture = TestBed.createComponent(TestHostComponent);
      });

      it('validation is shown when displayValidationMessageWhen returns true', () => {
        expect(configuration.displayValidationMessageWhen).not.toHaveBeenCalled();
        fixture.detectChanges();
        expect(configuration.displayValidationMessageWhen).toHaveBeenCalled();

        expectValidationIsShown();
      });

      it(`displayValidationMessageWhen's formSubmitted is undefined when a FormDirective is not provided`, () => {
        fixture.detectChanges();
        expect(configuration.displayValidationMessageWhen).toHaveBeenCalledWith(jasmine.any(FormControl), undefined);
      });
    });

    function expectValidationIsShown() {
      expect(fixture.nativeElement.querySelector('.invalid-feedback p').textContent).toEqual('A first name is required');
      expect(fixture.nativeElement.querySelector('.last-name-required').textContent).toEqual('A last name is required');
    }

    @Component({
      template: `
        <arv-validation-messages [for]="firstNameControl"></arv-validation-messages>
        <arv-validation-messages [for]="lastNameControl">
          <arv-validation-message key="required">
            <p class="last-name-required">A last name is required</p>
          </arv-validation-message>
        </arv-validation-messages>`
    })
    class TestHostComponent {
      firstNameControl: FormControl = new FormControl(null, [Validators.required('A first name is required')]);
      lastNameControl: FormControl = new FormControl(null, [Validators.required()]);
    }
  });

  it(`a child validation message without 'for' specified while parent has multiple controls throws an error`, () => {
    @Component({
      template: `
        <arv-validation-messages [for]="[firstNameControl, lastNameControl]">
          <arv-validation-message key="required"></arv-validation-message>
        </arv-validation-messages>`
    })
    class TestHostComponent {
      firstNameControl: FormControl = new FormControl(null);
      lastNameControl: FormControl = new FormControl(null);
    }

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ValidationMessagesComponent, ValidationMessageComponent, TestHostComponent]
    });

    const fixture = TestBed.createComponent(TestHostComponent);
    expect(() => fixture.detectChanges())
      .toThrowError(`Specify the FormControl for which the arv-validation-message element with key 'required' should show messages.`);
  });

  it(`a child validation message with a 'for' specified that's not in the parent throws an error`, () => {
    @Component({
      template: `
        <arv-validation-messages [for]="firstNameControl">
          <arv-validation-message [for]="lastNameControl" key="required"></arv-validation-message>
        </arv-validation-messages>`
    })
    class TestHostComponent {
      firstNameControl: FormControl = new FormControl(null);
      lastNameControl: FormControl = new FormControl(null);
    }

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ValidationMessagesComponent, ValidationMessageComponent, TestHostComponent]
    });

    const fixture = TestBed.createComponent(TestHostComponent);
    expect(() => fixture.detectChanges())
      .toThrowError(`A arv-validation-messages element with key 'required' attempts to show messages for a FormControl` +
      ` that is not declared in the parent arv-validation-messages element.`);
  });

  it(`a ValidationError without a message and without a child validation message component throws an error`, () => {
    @Component({
      template: `<arv-validation-messages [for]="firstNameControl"></arv-validation-messages>`
    })
    class TestHostComponent {
      firstNameControl: FormControl = new FormControl(null, [Validators.required()]);
    }

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ValidationMessagesComponent, ValidationMessageComponent, TestHostComponent]
    });

    const fixture = TestBed.createComponent(TestHostComponent);
    expect(() => fixture.detectChanges())
      .toThrowError(`There is no suitable arv-validation-message element to show the 'required' error of ''`);
  });

  xdescribe('', () => {
    let onerrorBeforeTest: OnErrorEventHandler;
    beforeEach(() => {
      onerrorBeforeTest = window.onerror;
    });
    afterEach(() => {
      window.onerror = onerrorBeforeTest;
    });

    it(`validates child validation message as they are shown or hidden through *ngIf`, (done: Function) => {
      @Component({
        template: `
          <arv-validation-messages [for]="firstNameControl">
            <arv-validation-message *ngIf="show" [for]="lastNameControl" key="required"></arv-validation-message>
          </arv-validation-messages>`
      })
      class TestHostComponent {
        firstNameControl: FormControl = new FormControl(null);
        lastNameControl: FormControl = new FormControl(null);
        show = false;
      }

      TestBed.configureTestingModule({
        imports: [ReactiveFormsModule],
        declarations: [ValidationMessagesComponent, ValidationMessageComponent, TestHostComponent]
      });

      // We can't simply expect().toThrowError(), because in RxJS 6, any error inside of 'next'
      // is asynchronously thrown, instead of synchronously as before. So these errors will never reach the call stack
      // of the expect() function. The observables also isn't exposed, and therefore we need to resort to catching
      // the error through window.onerror.
      window.onerror = event => {
        if (isErrorEvent(event)) {
          expect(event.error.message).toEqual(`A arv-validation-messages element with key 'required' attempts to show messages ` +
            `for a FormControl that is not declared in the parent arv-validation-messages element.`);
          done();

          // Though window.onerror is quirky, returning false generally works to suppress the error from reaching the console.
          return false;
        }
      };

      const fixture = TestBed.createComponent(TestHostComponent);
      fixture.detectChanges();
      fixture.componentInstance.show = true;
      fixture.detectChanges();
    });
  });
});

function isErrorEvent(event: Event | string): event is ErrorEvent {
  return (<ErrorEvent>event).error !== undefined;
}
