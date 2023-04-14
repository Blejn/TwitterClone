import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  matchPasswords,
  validateUsername,
} from 'src/app/validation/password-match.directive';
import { AuthService } from './../../../services/auth.service';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
})
export class RegisterFormComponent implements OnInit {
  registerForm!: FormGroup;
  @Output()
  changeMode = new EventEmitter();
  @Input()
  loginMode!: boolean;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}
  //bufferCount buffer rxjs

  ngOnInit(): void {
    this.registerForm = this.createRegisterForm();
  }

  createRegisterForm() {
    return this.formBuilder.group(
      {
        firstname: this.formBuilder.control('', [Validators.required]),
        lastname: this.formBuilder.control('', [Validators.required]),
        email: this.formBuilder.control('', [
          Validators.email,
          Validators.required,
        ]),
        username: this.formBuilder.control(
          '',
          [Validators.required, Validators.minLength(3)],
          validateUsername(this.authService)
        ),
        password: this.formBuilder.control('', [
          Validators.required,
          Validators.minLength(6),
        ]),
        repeatPassword: this.formBuilder.control('', [
          Validators.required,
          Validators.minLength(6),
        ]),
        location: this.formBuilder.control('', [Validators.required]),
        profile_picture: this.formBuilder.control(''),
        observer: this.formBuilder.control([]),
        posts: this.formBuilder.control([]),
        viewer: this.formBuilder.control([]),
      },
      { validators: matchPasswords('password', 'repeatPassword') }
    );
  }
  modeChanged() {
    this.changeMode.emit(!this.loginMode);
  }
  registerHandler() {
    let user = this.registerForm.getRawValue();
    console.log(user);
    this.authService.register(user).subscribe(() => {
      alert('your register success');
      this.modeChanged();
    });
  }
}
