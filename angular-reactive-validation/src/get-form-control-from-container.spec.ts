import { TestBed, inject } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';

import { getFormControlFromContainer } from './get-form-control-from-container';

describe('getFormControlFromContainer', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FormBuilder
      ]
    });
  });

  it(`gets a FormControl from the FormGroup`, inject([FormBuilder], (fb: FormBuilder) => {
    const firstName = fb.control('');
    const group = fb.group({
      firstName: firstName
    });

    const container: any = {
      control: group
    };

    expect(getFormControlFromContainer('firstName', container)).toBe(firstName);
  }));

  it(`throws an Error when no container is provided`, inject([FormBuilder], (fb: FormBuilder) => {
    expect(() => getFormControlFromContainer('firstName', undefined)).toThrow(new Error(
      `You can't pass a string to arv-validation-messages's for attribute, when the ` +
      `arv-validation-messages element is not a child of an element with a formGroupName or formGroup declaration.`));
  }));

  it(`throws an Error when there is no FormControl with the given name`, inject([FormBuilder], (fb: FormBuilder) => {
    const group = fb.group({});

    const container: any = {
      control: group,
      path: ['the', 'path']
    };

    expect(() => getFormControlFromContainer('lastName', container)).toThrow(new Error(
      `There is no control named 'lastName' within 'the.path'.`
    ));
  }));

  it(`throws an Error when there is a FormGroup with the given name`, inject([FormBuilder], (fb: FormBuilder) => {
    const group = fb.group({
      name: fb.group({})
    });

    const container: any = {
      control: group,
      path: ['the', 'path']
    };

    expect(() => getFormControlFromContainer('name', container)).toThrow(new Error(
      `The control named 'name' within 'the.path' is not a FormControl. Maybe you accidentally referenced a FormGroup or FormArray?`
    ));
  }));

  it(`throws an Error when there is a FormArray with the given name`, inject([FormBuilder], (fb: FormBuilder) => {
    const group = fb.group({
      name: fb.array([])
    });

    const container: any = {
      control: group,
      path: ['the', 'path']
    };

    expect(() => getFormControlFromContainer('name', container)).toThrow(new Error(
      `The control named 'name' within 'the.path' is not a FormControl. Maybe you accidentally referenced a FormGroup or FormArray?`
    ));
  }));
});
