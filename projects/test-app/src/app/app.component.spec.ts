import { UntypedFormBuilder } from '@angular/forms';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Component } from '@angular/core';
describe('AppComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent, MockValidationMessageComponent, MockValidationMessagesComponent],
      providers: [UntypedFormBuilder],
    }).compileComponents();
  }));

  it('should create the app', waitForAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it(`should have as title 'app'`, waitForAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('app');
  }));
  // it('should render title in a h1 tag', waitForAsync(() => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   const compiled = fixture.debugElement.nativeElement;
  //   expect(compiled.querySelector('h1').textContent).toContain('Welcome to app!');
  // }));
});

@Component({
    selector: 'arv-validation-message',
    template: '',
    standalone: false
})
class MockValidationMessageComponent { }


@Component({
    selector: 'arv-validation-messages',
    template: '',
    standalone: false
})
class MockValidationMessagesComponent { }
