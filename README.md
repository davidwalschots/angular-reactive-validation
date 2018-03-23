# Overview

Angular provides two ways to specify validation. You can add validation in a template-driven fashion where you use HTML attributes such as minLength. Or you can use reactive form validation where you specify the validation constraints within FormControl and FormGroup instances. The Angular Validation Library to be built will focus on the latter type and will attempt to remove some of the downsides of this approach. The library is opinionated on how validation and its associated messages should be declared. If potential users do not share this opinion, they should use a different library or build something themselves.

# Goals

1. Let the developer declare the validation message in the same location as the validation constraints to reduce the chance of message and constraints mismatching between the reactive forms spec and HTML.
2. Let the developer declare the location within HTML where validation messages for one or more controls should be displayed.
3. Let the developer declare the visual layout of validation messages, by using a number of CSS class hooks made available by the library.
4. Let the developer specify a custom visual style and custom error message for edge-cases where the standard style or message capabilities do not suffice. This use case should contain various safeguards that verify that validation constraints are in fact declared within the model. Also, the constraint values should be made available to be used within the custom error message, such that these values do not need to be duplicated in two locations.
5. Use a HTML style somewhat resembling the ng-messages style found within AngularJS.
6. The library is fully tested by using the Jasmine framework.
