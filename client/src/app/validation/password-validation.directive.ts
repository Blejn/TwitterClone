import { Directive, Injectable } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
} from '@angular/forms';
@Injectable({
  providedIn: 'root',
})
@Directive({
  selector: '[emailValidation]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useFactory: PasswordValidationDirective,
      multi: true,
    },
  ],
})
export class PasswordValidationDirective {
  constructor() {}
  validate(control: AbstractControl<string, any>): ValidationErrors | null {
    const hasValidPassword = control.value.match(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
    );
    if (hasValidPassword) {
      return null;
    }
    return { badPassword: true };
  }
}
