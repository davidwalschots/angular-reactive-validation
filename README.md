# Angular Reactive Validation

Reactive Forms validation shouldn't require the developer to write lots of HTML to show validation messages. This library makes it easy.

## Table of contents

* [Installation](#installation)
* [Basic usage](#basic-usage)
* [Advanced validation declaration](#advanced-validation-declaration)
* [Changing when validation messages are displayed](#changing-when-validation-messages-are-displayed)
* [Declaring your own validator functions](#declaring-your-own-validator-functions)
* [Edge use cases](#edge-use-cases)
  * [Handling custom HTML validation messages](#handling-custom-html-validation-messages)
  * [Using arv-validation-messages when not using `[formGroup]` or `formGroupName` attributes](#using-arv-validation-messages-when-not-using-formgroup-or-formgroupname-attributes)

## Installation

To install this library, run:

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
import { Validators } from 'angular-reactive-validation';

...

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
<!-- Display validation messages for a single control. -->
<arv-validation-messages for="age"></arv-validation-messages>

<!-- Display validation messages for multiple controls in one location. -->
<arv-validation-messages [for]="['firstName', 'middleName', 'lastName']"></arv-validation-messages>
```

Make changes to the styling of the validation messages when needed by using the `invalid-feedback` class. E.g.:

```scss
.invalid-feedback {
  width: 100%;
  margin-top: .25rem;
  font-size: 80%;
  color: red;
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

## Changing when validation messages are displayed

By default validation messages are displayed when the associated control is touched, or when the form has been submitted while the `arv-validation-messages` component was instantiated (meaning any hidden elements would not show their validation until a resubmit).

This implementation can be overridden by changing the module import as follows:

```ts
import { ReactiveValidationModule } from 'angular-reactive-validation';

@NgModule({
  imports: [
    ...,
    ReactiveValidationModule.forRoot({
      displayValidationMessageWhen: (control, formSubmitted) => {
        return true; // Replace with your implementation.
      }
    })
  ]
})
export class AppModule { }
```

Note that `formSubmitted` can be undefined when it's not known if the form is submitted, due to the form tag missing a formGroup attribute.

## Declaring your own validator functions

Angular provides a limited set of validator functions. To declare your own validator functions _and_ combine it with this library use the `ValidatorDeclaration` class. It supports declaring validators with zero, one or two arguments.

**Note** that if your validator doesn't return an object as the inner error result, but e.g. a `boolean` such as in the examples below, then this will be replaced by an object that can hold the validation message. Thus, in the first example below `{ 'hasvalue': true }` becomes `{ 'hasvalue': { 'message': 'validation message' } }`.

```ts
const hasValueValidator = ValidatorDeclaration.wrapNoArgumentValidator(control => {
  return !!control.value ? null : { 'hasvalue': true };
}, 'hasvalue');

const formControl = new FormControl('', hasValueValidator('error message to show'));
```

```ts
const minimumValueValidator = ValidatorDeclaration.wrapSingleArgumentValidator((min: number) => {
  return function(control: AbstractControl): ValidationErrors {
    return control.value >= min ? null : { 'min': true };
  };
}, 'min');

const formControl = new FormControl('', minimumValueValidator(5, 'error message to show'));
```

```ts
const betweenValueValidator = ValidatorDeclaration.wrapTwoArgumentValidator((min: number, max: number) => {
  return function(control: AbstractControl): ValidationErrors {
    return control.value >= min && control.value <= max ? null : { 'between': true };
  };
}, 'between');

const formControl = new FormControl('', betweenValueValidator(5, 10, 'error message to show'));
```

Wrapping validator functions provided by other packages is also very simple:

```ts
const minValidator = ValidatorDeclaration.wrapSingleArgumentValidator(AngularValidators.min, 'min')
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

Note that unlike the default Angular validation, parameterless functions need to be called to work properly:

```ts
Validators.required()
Validators.requiredTrue()
Validators.email()
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
