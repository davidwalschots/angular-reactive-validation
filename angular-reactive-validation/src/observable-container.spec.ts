import { TestBed, inject } from '@angular/core/testing';

import { ObservableContainer } from './observable-container';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

describe('ObservableContainer', () => {
  let subject: Subject<{}>;
  beforeEach(() => {
    subject = new Subject();
  });

  it(`calls the function when the observable emits`, () => {
    let called = false;
    const container = new ObservableContainer(() => called = true);

    container.subscribe({}, () => subject);
    expect(called).toBe(false);
    subject.next();
    expect(called).toBe(true);
  });

  it(`calls the function on subscribe`, () => {
    let called = false;
    const container = new ObservableContainer(() => called = true);

    container.subscribe({}, () => subject, true);
    expect(called).toBe(true);
  });

  it(`calls the function multiple times when the observable emits multiple times`, () => {
    let calls = 0;
    const container = new ObservableContainer(() => calls++);

    container.subscribe({}, () => subject);
    expect(calls).toBe(0);
    subject.next();
    subject.next();
    expect(calls).toBe(2);
  });

  it(`calls the function once per subscribing object`, () => {
    let calls = 0;
    const objA = {};
    const objB = {};
    const container = new ObservableContainer(obj => {
      if (calls === 0) {
        expect(obj).toEqual(objA);
      } else {
        expect(obj).toEqual(objB);
      }
      calls++;
    });

    container.subscribe([objA, {}], () => subject);
    expect(calls).toBe(0);
    subject.next();
    expect(calls).toBe(2);
  });

  it(`unsubscribes and no longer calls the function when the observable emits`, () => {
    let calls = 0;
    const container = new ObservableContainer(() => calls++);

    container.subscribe([{}, {}], () => subject);
    expect(subject.observers.length).toBe(2);

    container.unsubscribeAll();
    expect(subject.observers.length).toBe(0);

    subject.next();
    expect(calls).toBe(0);
  });

  it(`doesn't subscribe or call the function when no objects are provided`, () => {
    let called = false;
    const container = new ObservableContainer(() => called = true);

    container.subscribe([], () => subject);
    expect(subject.observers.length).toBe(0);
    expect(called).toBe(false);
    subject.next();
    expect(called).toBe(false);
  });
});
