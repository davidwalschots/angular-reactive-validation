import { AfterContentInit } from '@angular/core';

/**
 * Wraps a function that should be called after the component's AfterContentInit lifecycle hook has been called.
 * Note that executeAfterContentInit has to be called before the AfterContentInit lifecycle hook has been called.
 *
 * @param func the function to execute AfterContentInit.
 * @param component The component that needs to have AfterContentInit called before calling the function.
 * @returns The returned function accepts the same arguments and can be called at any time, before or after AfterContentInit
 * has been called. Note that if AfterContentInit has already been called when calling this function, the wrapped function
 * will be called immediately.
 */
export function executeAfterContentInit(func: (...args: any[]) => void, component: AfterContentInit): (...args: any[]) => void {
  const functionsToExecuteAfterContentInit: (() => void)[] = [];
  let afterContentInitCalled = false;

  const originalAfterContentInit = component.ngAfterContentInit;
  component.ngAfterContentInit = () => {
    if (afterContentInitCalled) {
      return;
    }

    afterContentInitCalled = true;
    originalAfterContentInit.call(component);

    functionsToExecuteAfterContentInit.forEach(f => f());
  };

  return function(...args: any[]) {
    if (afterContentInitCalled) {
      func(...args);
    } else {
      functionsToExecuteAfterContentInit.push(() => {
        func(...args);
      });
    }
  };
}
