import { AbstractControl, FormGroup } from '@angular/forms';
import { AuthService } from '../services/auth.service';

//FUNCTON FOR MATCHING PASSWORD WITH REPEATPASSWORD
export function matchPasswords(password: string, repeatPassword: string) {
  return (form: FormGroup) => {
    const passwordValue = form.controls[password];
    const confirmPassword = form.controls[repeatPassword];

    if (passwordValue.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordNotMatch: true });
    } else confirmPassword.setErrors(null);
  };
}
//FUNCTION FOR GETTING USERNAMES
export function validateUsername(authService: AuthService) {
  return (control: AbstractControl): Promise<any> => {
    const value = control.value.toLowerCase();
    let notAllowed: string[] | any[] = [];
    const response = new Promise((resolve, reject) => {
      authService.getAllUsers().subscribe((usernames) => {
        notAllowed = [...usernames];

        setTimeout(() => {
          console.log(notAllowed.includes(value));
          if (notAllowed.includes(value)) {
            resolve({ usernameExist: true });
          }
          resolve(null);
        }, 6000);
      });
    });
    return response;
  };
}
