import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (value && !strongPasswordRegex.test(value)) {
      return {
        weakPassword:
          'Password must contain at least 8 characters, an uppercase letter, a number, and a special character',
      };
    }
    return null;
  };
}
