import { AbstractControl } from '@angular/forms';

/**
 * Given a control, returns a string representation of the property path to
 * this control. Thus, for a FormControl 'firstName', that is part of a
 * FormGroup references to as 'name', this function will return: 'name.firstName'.
 *
 * Note that FormArray indexes are also put in the path, e.g.: 'person.0.name.firstName'.
 */
export function getControlPath(control: AbstractControl): string {
  if (control.parent) {
    let path = getControlPath(control.parent);
    if (path) {
      path += '.';
    }
    return path + Object.keys(control.parent.controls).find(key => {
      const controls = control.parent.controls;
      if (Array.isArray(controls)) {
        return controls[Number(key)] === control;
      } else {
        return controls[key] === control;
      }
    });
  }

  return '';
}
