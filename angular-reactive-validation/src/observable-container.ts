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

  /**
   * @param nextFunction The function which should be called when the Observable emits.
   */
  constructor(private nextFunction: (item: T) => void) { }

  /**
   * Subscribe the given item to the given Observable.
   * @param item The item which should be used when calling the nextFunction provided through the constructor.
   * @param getObservable Function that gets an Observable from the item provided.
   * @param callOnSubscribe Determines if the nextFunction should be called immediately after subscribing, even
   * if the observable hasn't emitted anything. Defaults to false.
   */
  subscribe<TObservable>(item: T, getObservable: (item: T) => Observable<TObservable>, callOnSubscribe?: boolean): void;
  /**
   * Subscribe the given items to the given Observable.
   * @param items The items which should be used when calling the nextFunction provided through the constructor.
   * @param getObservable Function that gets an Observable from the items provided.
   * @param callOnSubscribe Determines if the nextFunction should be called immediately after subscribing, even
   * if the observable hasn't emitted anything. Defaults to false.
   */
  subscribe<TObservable>(items: T[], getObservable: (item: T) => Observable<TObservable>, callOnSubscribe?: boolean): void;
  subscribe<TObservable>(items: T | T[], getObservable: (item: T) => Observable<TObservable>, callOnSubscribe: boolean = false): void {
    if (!items) {
      return;
    }

    if (!Array.isArray(items)) {
      items = [items];
    }

    items.forEach(item => {
      const subscription = getObservable(item).subscribe(() => {
        this.nextFunction(item);
      });
      this.subscriptions.push(subscription);

      if (callOnSubscribe) {
        this.nextFunction(item);
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
}
