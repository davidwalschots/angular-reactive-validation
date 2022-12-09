import { TestBed, inject } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';

import { getControlPath } from './get-control-path';

describe('getControlPath', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UntypedFormBuilder
      ]
    });
  });

  it(`emits paths for form groups`, inject([UntypedFormBuilder], (fb: UntypedFormBuilder) => {
    const firstName = fb.control('');
    fb.group({
      name: fb.group({
        firstName: firstName
      })
    });

    expect(getControlPath(firstName)).toEqual('name.firstName');
  }));

  it(`emits numeric paths for form arrays`, inject([UntypedFormBuilder], (fb: UntypedFormBuilder) => {
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

    expect(getControlPath(firstName)).toEqual('persons.0.firstName');
    expect(getControlPath(firstName2)).toEqual('persons.1.firstName');
  }));

  it(`emits an empty string for a control without parents`, inject([UntypedFormBuilder], (fb: UntypedFormBuilder) => {
    const control = fb.control('');

    expect(getControlPath(control)).toEqual('');
  }));

  it(`emits an index string for a control with only a form array as parent`, inject([UntypedFormBuilder], (fb: UntypedFormBuilder) => {
    const control = fb.control('');

    fb.array([control]);

    expect(getControlPath(control)).toEqual('0');
  }));

  it(`emits a single identifier for a control with only a single form group as parent`, inject([UntypedFormBuilder], (fb: UntypedFormBuilder) => {
    const control = fb.control('');

    fb.group({
      control: control
    });

    expect(getControlPath(control)).toEqual('control');
  }));
});
