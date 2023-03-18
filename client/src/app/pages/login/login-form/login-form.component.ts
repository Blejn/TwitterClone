import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnInit {
  loginForm!: FormGroup;
  @Output() changeMode = new EventEmitter();
  @Input() loginMode!: boolean;
  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.loginForm = this.createLoginForm();
  }

  createLoginForm() {
    return this.formBuilder.group({
      username: this.formBuilder.control('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      password: this.formBuilder.control('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }
  modeChanged() {
    this.changeMode.emit(!this.loginMode);
    console.log(this.loginMode);
  }

  loginHandler() {
    console.log(this.loginForm.get('username'), this.loginForm.get('password'));
  }
}
