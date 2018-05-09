import { Subject } from 'rxjs';

import { ObservableContainer } from './observable-container';

describe('ObservableContainer', () => {
  let subject: Subject<{}>;
  beforeEach(() => {
    subject = new Subject();
  });

  it(`calls the function when the observable emits`, () => {
    let called = false;
    const container = new ObservableContainer(() => called = true);

    container.subscribe({}, () => subject);
    expect(called).toEqual(false);
    subject.next();
    expect(called).toEqual(true);
  });

  it(`calls the function on subscribe`, () => {
    let called = false;
    const container = new ObservableContainer(() => called = true);

    container.subscribe({}, () => subject, true);
    expect(called).toEqual(true);
  });

  it(`calls the function multiple times when the observable emits multiple times`, () => {
    let calls = 0;
    const container = new ObservableContainer(() => calls++);

    container.subscribe({}, () => subject);
    expect(calls).toEqual(0);
    subject.next();
    subject.next();
    expect(calls).toEqual(2);
  });

  it(`calls the function once per subscribing object`, () => {
    let calls = 0;
    const objA = { x: 1 };
    const objB = { x: 2 };
    const container = new ObservableContainer(obj => {
      if (calls === 0) {
        expect(obj).toBe(objA);
      } else {
        expect(obj).toBe(objB);
      }
      calls++;
    });

    container.subscribe([objA, objB], () => subject);
    expect(calls).toEqual(0);
    subject.next();
    expect(calls).toEqual(2);
  });

  it(`unsubscribes and no longer calls the function when the observable emits`, () => {
    let calls = 0;
    const container = new ObservableContainer(() => calls++);

    container.subscribe([{}, {}], () => subject);
    expect(subject.observers.length).toEqual(2);

    container.unsubscribeAll();
    expect(subject.observers.length).toEqual(0);

    subject.next();
    expect(calls).toEqual(0);
  });

  it(`doesn't subscribe or call the function when no objects are provided`, () => {
    let called = false;
    const container = new ObservableContainer(() => called = true);

    container.subscribe([], () => subject);
    expect(subject.observers.length).toEqual(0);
    expect(called).toEqual(false);
    subject.next();
    expect(called).toEqual(false);
  });
});
