import { AfterContentInit } from '@angular/core';

import { executeAfterContentInit } from './execute-after-content-init';

let componentMock: AfterContentInit;
let toBeCalled: { func: () => void; };

describe('executeAfterContentInit', () => {
  beforeEach(() => {
    componentMock = {
      ngAfterContentInit: () => {
      }
    };

    toBeCalled = {
      func: () => {
      }
    };
  });

  // Sadly Angular doesn't provide the actual lifecycle status of a component. Therefore, the
  // executeAfterContentInit can't handle situations where it is called after a component has already
  // passed the afterContentInit state.
  it(`doesn't call the supplied function if called after ngAfterContentInit is called on the component`, () => {
    spyOn(toBeCalled, 'func');

    componentMock.ngAfterContentInit();
    executeAfterContentInit(toBeCalled.func, componentMock)();
    expect(toBeCalled.func).not.toHaveBeenCalled();
  });

  it(`calls the supplied function after ngAfterContentInit is called on the component`, () => {
    spyOn(toBeCalled, 'func');

    executeAfterContentInit(toBeCalled.func, componentMock)();
    expect(toBeCalled.func).not.toHaveBeenCalled();

    componentMock.ngAfterContentInit();

    expect(toBeCalled.func).toHaveBeenCalled();
  });

  it(`passes through calls to the supplied function when ngAfterContentInit is already called on the component`, () => {
    spyOn(toBeCalled, 'func');

    const f = executeAfterContentInit(toBeCalled.func, componentMock);
    componentMock.ngAfterContentInit();

    expect(toBeCalled.func).not.toHaveBeenCalled();
    f();
    expect(toBeCalled.func).toHaveBeenCalled();
  });

  it(`doesn't call supplied functions multiple times if ngAfterContentInit is called multiple times`, () => {
    spyOn(toBeCalled, 'func');

    executeAfterContentInit(toBeCalled.func, componentMock)();

    componentMock.ngAfterContentInit();
    componentMock.ngAfterContentInit();

    expect(toBeCalled.func).toHaveBeenCalledTimes(1);
  });
});
