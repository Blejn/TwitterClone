import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
})
export class RegisterFormComponent implements OnInit {
  registerForm!: FormGroup;
  constructor(private formBuilder: FormBuilder) {}

  registerHandler() {}
  ngOnInit(): void {}
  createRegisterForm() {
    return this.formBuilder.group({
      firstname: this.formBuilder.control('', [Validators.required]),
      lastname: this.formBuilder.control('', [Validators.required]),
      email: this.formBuilder.control('', [
        Validators.email,
        Validators.required,
      ]),
      username: this.formBuilder.control('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      password: this.formBuilder.control('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      repeatPassword: this.formBuilder.control('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      location: this.formBuilder.control('', [Validators.required]),
      profilePicture: this.formBuilder.control(''),
    });
  }
  modeChanged() {}
}
