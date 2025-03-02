import { Directive, Input, HostBinding } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
} from '@angular/forms';

@Directive({
  selector: '[appFormValidation]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: FormValidationDirective,
      multi: true,
    },
  ],
})
export class FormValidationDirective implements Validator {
  @Input('appFormValidation') validationRule!: string;

  validate(control: AbstractControl): ValidationErrors | null {
    if (this.validationRule === 'required' && !control.value) {
      return { required: true };
    }
    return null;
  }
}
