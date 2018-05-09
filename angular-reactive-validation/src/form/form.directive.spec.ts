import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { FormDirective } from './form.directive';

describe('FormDirective', () => {
  it(`submitted observable emits when the form is submitted`, () => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [FormDirective, TestHostComponent]
    });

    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const formDirective = fixture.debugElement
      .query(By.directive(FormDirective))
      .injector.get(FormDirective);

    let called = false;
    formDirective.submitted.subscribe(() => {
      called = true;
    });

    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();

    expect(called).toEqual(true);
  });

  @Component({
    template: `
    <form [formGroup]="form">
      <button type="submit"></button>
    </form>`
  })
  class TestHostComponent {
    form = new FormGroup({});
  }
});
