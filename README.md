# Angular Reactive Validation

I believe Reactive Forms validation shouldn't require the developer to write lots of HTML to show validation messages. This library makes it easy.

## Installation

To install this library, run:

**NOT YET AVAILABLE**

```bash
npm install angular-reactive-validation --save
```

## Basic usage

Import the `ReactiveValidationModule`:

```ts
import { ReactiveValidationModule } from 'angular-reactive-validation';

@NgModule({
  imports: [
    ...,
    ReactiveValidationModule
  ]
})
export class AppModule { }
```

Declare your validation with messages:

```ts
form = this.fb.group({
  name: this.fb.group({
    firstName: ['', [Validators.required('A first name is required'),
      Validators.minLength(1, minLength => `The minimum length is ${minLength}`),
      Validators.maxLength(50, maxLength => `Maximum length is ${maxLength}`)]],
    middleName: ['', [Validators.maxLength(50, maxLength => `Maximum length is ${maxLength}`)]],
    lastName: ['', [Validators.required('A last name is required'),
      Validators.maxLength(50, maxLength => `Maximum length is ${maxLength}`)]]
  }),
  age: [null, [
    Validators.required('An age is required'),
    Validators.min(0, 'You can\'t be less than zero years old.'),
    Validators.max(150, max => `Can't be more than ${max}`)
  ]]
});
```

See [Advanced validation declaration](#advanced-validation-declaration) for other ways to declare your validation.

Add the component that will display the messages to your HTML:

```html
...

<!-- Display validation messages for multiple controls in one location. -->
<arv-validation-messages [for]="['firstName', 'middleName', 'lastName']"></arv-validation-messages>

...

<!-- Display validation messages for a single control. -->
<arv-validation-messages for="age"></arv-validation-messages>
```

Make changes to the default styling of the validation messages when needed:

```scss
.invalid-feedback {
  width: 100%;
  margin-top: .25rem;
  font-size: 80%;
  color: #dc3545;
}
```

## Advanced validation declaration

The library supports specifying validators in a number of ways:

With a static message:

```ts
Validators.minLength(1, 'The minimum length is not reached.')
```

With a dynamic message, which is passed the validation value:

```ts
Validators.minLength(1, minLength => `The minimum length is ${minLength}.`)
```

With a dynamic validation value:

```ts
Validators.minLength(() => this.getMinimumLength(), 'The minimum length is not reached.')
```

Or combining the two options above:

```ts
Validators.minLength(() => this.getMinimumLength(), minLength => `The minimum length is ${minLength}.`)
```

## Edge use cases

### Handling custom HTML validation messages

Though not the purpose of this library. There might be times when you want to declare a validation message within your HTML, because it requires some custom formatting. Therefore, all the `Validators` can also be used without declaring a message:

```ts
Validators.minLength(() => this.getMinimumLength())
```

And the following HTML can be used:

```html
<arv-validation-messages for="age">
  <arv-validation-message key="min">
    Your custom validation message HTML for the minimum value validation.
  </arv-validation-message>
</arv-validation-messages>
```

If the `arv-validation-messages`'s `for` attribute specifies multiple controls, be sure to declare the `for` attribute on the `arv-validation-message` element as well:

```html
<arv-validation-messages [for]="['firstName', 'middleName', 'lastName']">
  <arv-validation-message for="firstName" key="required">
    Your custom validation message HTML for the required validation.
  </arv-validation-message>
  <arv-validation-message for="firstName" key="minlength">
    Your custom validation message HTML for the minlength validation.
  </arv-validation-message>
</arv-validation-messages>
```

### Using arv-validation-messages when not using `[formGroup]` or `formGroupName` attributes

Supplying FormControl instances instead of names is also supported:

```html
<arv-validation-messages [for]="[form.get('name.firstName'), form.get('name.middleName'), form.get('name.lastName')]">
  <arv-validation-message [for]="form.get('name.firstName')" key="required">
    ...
  </arv-validation-message>
</arv-validation-messages>
```

## Future development

The following features are to be added or are under investigation:

* Creating your own validators and using them together with this library.
* Providing interfaces for using other popular validation libraries within `angular-reactive-validation`.
