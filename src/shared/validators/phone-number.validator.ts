import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function phoneNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    const phoneRegex = /^[0-9]{10}$/; // Validates 10-digit phone number
    if (value && !phoneRegex.test(value)) {
      return { invalidPhoneNumber: 'Phone number must be 10 digits' };
    }
    return null;
  };
}
