import { ValidationError } from './validation-error';

describe('ValidationError', () => {
  it(`fromFirstError takes the first error object from a FormControl`, () => {
    const requiredErrorObject = {};
    const control: any = {
      errors: {
        required: requiredErrorObject,
        test: true
      }
    };
    const error = ValidationError.fromFirstError(control);

    expect(error).not.toBeUndefined();
    expect((error as ValidationError).control).toEqual(control);
    expect((error as ValidationError).key).toEqual('required');
    expect((error as ValidationError).errorObject).toEqual(requiredErrorObject);
  });

  it(`fromFirstError returns undefined when the FormControl has no errors`, () => {
    const control: any = {
      errors: null
    };
    const error = ValidationError.fromFirstError(control);

    expect(error).toEqual(undefined);
  });

  it(`hasMessage returns true when the errorObject contains a message`, () => {
    const control: any = {
      errors: {
        required: {
          message: 'This is the expected message'
        }
      }
    };
    const error = ValidationError.fromFirstError(control);

    expect(error).not.toBeUndefined();
    expect((error as ValidationError).hasMessage()).toEqual(true);
  });

  it(`hasMessage returns false when the errorObject doesn't contain a message`, () => {
    const control: any = {
      errors: {
        required: {}
      }
    };
    const error = ValidationError.fromFirstError(control);

    expect(error).not.toBeUndefined();
    expect((error as ValidationError).hasMessage()).toEqual(false);
  });

  it(`getMessage returns the message from the errorObject`, () => {
    const expected = 'This is the expected message';
    const control: any = {
      errors: {
        required: {
          message: expected
        }
      }
    };
    const error = ValidationError.fromFirstError(control);

    expect(error).not.toBeUndefined();
    expect((error as ValidationError).getMessage()).toEqual(expected);
  });
});
