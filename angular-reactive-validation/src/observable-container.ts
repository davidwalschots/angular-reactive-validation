import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

export class ObservableContainer<T> {
  private subscriptions: Subscription[] = [];
  private subscribeFunction: (item: T) => void;

  constructor(subscribeFunction: (item: T) => void) {
    this.subscribeFunction = subscribeFunction;
  }

  subscribe(item: T, getObservable: (item: T) => Observable<T>, callOnSubscribe?: boolean);
  subscribe(items: T[], getObservable: (item: T) => Observable<T>, callOnSubscribe?: boolean);
  subscribe(items: T | T[], getObservable: (item: T) => Observable<T>, callOnSubscribe: boolean = false) {
    if (!items) {
      return;
    }

    if (!Array.isArray(items)) {
      items = [items];
    }

    items.forEach(item => {
      const subscription = getObservable(item).subscribe(this.subscribeFunction);
      this.subscriptions.push(subscription);

      if (callOnSubscribe) {
        this.subscribeFunction(item);
      }
    });
  }

  unsubscribeAll() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions.length = 0;
  }
}
