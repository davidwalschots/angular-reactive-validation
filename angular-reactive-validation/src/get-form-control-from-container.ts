import { UntypedFormGroup, UntypedFormControl, ControlContainer, FormGroupDirective } from '@angular/forms';

export const getFormControlFromContainer = (name: string, controlContainer: ControlContainer | undefined): UntypedFormControl => {
  if (controlContainer) {
    const control = (controlContainer.control as UntypedFormGroup).controls[name];
    if (!control) {
      throw new Error(`There is no control named '${name}'` +
        (getPath(controlContainer).length > 0 ? ` within '${getPath(controlContainer).join('.')}'` : '') + '.');
    }
    if (!(control instanceof UntypedFormControl)) {
      throw new Error(`The control named '${name}' ` +
        (getPath(controlContainer).length > 0 ? `within '${getPath(controlContainer).join('.')}' ` : '') +
        `is not a FormControl. Maybe you accidentally referenced a FormGroup or FormArray?`);
    }

    return control;
  } else {
    throw new Error(`You can't pass a string to arv-validation-messages's for attribute, when the ` +
      `arv-validation-messages element is not a child of an element with a formGroupName or formGroup declaration.`);
  }
};

export const isControlContainerVoidOrInitialized = (controlContainer: ControlContainer | undefined) =>
!!(!controlContainer || (controlContainer as FormGroupDirective).form ||
    (controlContainer.formDirective && (controlContainer.formDirective as FormGroupDirective).form));

const getPath = (controlContainer: ControlContainer): string[] => controlContainer.path || [];
