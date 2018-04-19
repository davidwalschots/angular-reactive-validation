import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { AfterContentInit } from '@angular/core';

/**
 * Manages subscribing and unsubscribing to an Observable and executing
 * a function when that Observable emits. Also handles hooking into
 * Angular afterContentInit lifecycle event.
 */
export class ObservableContainer<T> {
  private subscriptions: Subscription[] = [];
  private functionsToExecuteAfterContentInit: (() => void)[] = [];

  /**
   * @param nextFunction The function which should be called when the Observable emits.
   * @param afterContentInitHook An optional argument which is used to hook into the Angular
   * afterContentInit lifecycle event to only execute calls to the nextFunction after content has been initialized.
   */
  constructor(private nextFunction: (item: T) => void, private afterContentInitHook?: AfterContentInit) {
    if (this.afterContentInitHook) {
      const originalAfterContentInit = this.afterContentInitHook.ngAfterContentInit;
      this.afterContentInitHook.ngAfterContentInit = () => {
        originalAfterContentInit.call(this.afterContentInitHook);

        this.functionsToExecuteAfterContentInit.forEach(func => func());

        this.afterContentInitHook.ngAfterContentInit = originalAfterContentInit;
        this.afterContentInitHook = undefined;
      };
    }
  }

  /**
   * Subscribe the given item to the given Observable.
   * @param item The item which should be used when calling the nextFunction provided through the constructor.
   * @param getObservable Function that gets an Observable from the item provided.
   * @param callOnSubscribe Determines if the nextFunction should be called immediately after subscribing, even
   * if the observable hasn't emitted anything. Defaults to false.
   */
  subscribe<TObservable>(item: T, getObservable: (item: T) => Observable<TObservable>, callOnSubscribe?: boolean);
  /**
   * Subscribe the given items to the given Observable.
   * @param items The items which should be used when calling the nextFunction provided through the constructor.
   * @param getObservable Function that gets an Observable from the items provided.
   * @param callOnSubscribe Determines if the nextFunction should be called immediately after subscribing, even
   * if the observable hasn't emitted anything. Defaults to false.
   */
  subscribe<TObservable>(items: T[], getObservable: (item: T) => Observable<TObservable>, callOnSubscribe?: boolean);
  subscribe<TObservable>(items: T | T[], getObservable: (item: T) => Observable<TObservable>, callOnSubscribe: boolean = false) {
    if (!items) {
      return;
    }

    if (!Array.isArray(items)) {
      items = [items];
    }

    items.forEach(item => {
      const subscription = getObservable(item).subscribe(() => {
        this.callNextFunction(item);
      });
      this.subscriptions.push(subscription);

      if (callOnSubscribe) {
        this.callNextFunction(item);
      }
    });
  }

  /**
   * Unsubscribe from all the Subscriptions.
   */
  unsubscribeAll() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions.length = 0;
  }

  private callNextFunction(item: T) {
    if (this.afterContentInitHook) {
      this.functionsToExecuteAfterContentInit.push(() => this.nextFunction(item));
    } else {
      this.nextFunction(item);
    }
  }
}
