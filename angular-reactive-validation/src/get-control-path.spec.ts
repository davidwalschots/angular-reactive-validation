import { TestBed, inject } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';

import { getControlPath } from './get-control-path';

describe('getControlPath', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FormBuilder
      ]
    });
  });

  it(`emits paths for form groups`, inject([FormBuilder], (fb: FormBuilder) => {
    const firstName = fb.control('');
    fb.group({
      name: fb.group({
        firstName: firstName
      })
    });

    expect(getControlPath(firstName)).toBe('name.firstName');
  }));

  it(`emits numeric paths for form arrays`, inject([FormBuilder], (fb: FormBuilder) => {
    const firstName = fb.control('');
    const firstName2 = fb.control('');

    fb.group({
      persons: fb.array([
        fb.group({
          firstName: firstName
        }),
        fb.group({
          firstName: firstName2
        })
      ])
    });

    expect(getControlPath(firstName)).toBe('persons.0.firstName');
    expect(getControlPath(firstName2)).toBe('persons.1.firstName');
  }));

  it(`emits an empty string for a control without parents`, inject([FormBuilder], (fb: FormBuilder) => {
    const control = fb.control('');

    expect(getControlPath(control)).toBe('');
  }));

  it(`emits an index string for a control with only a form array as parent`, inject([FormBuilder], (fb: FormBuilder) => {
    const control = fb.control('');

    fb.array([control]);

    expect(getControlPath(control)).toBe('0');
  }));

  it(`emits a single identifier for a control with only a single form group as parent`, inject([FormBuilder], (fb: FormBuilder) => {
    const control = fb.control('');

    fb.group({
      control: control
    });

    expect(getControlPath(control)).toBe('control');
  }));
});
