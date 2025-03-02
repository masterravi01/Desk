import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function minMaxValidator(min: number, max: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value && (value < min || value > max)) {
      return { outOfRange: `Value must be between ${min} and ${max}` };
    }
    return null;
  };
}
