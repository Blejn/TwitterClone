import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { UserLogin } from 'src/app/interfaces/UserLogin';
import { AuthService } from 'src/app/services/auth.service';
import { CookieServiceService } from 'src/app/services/cookie-service.service';
import { TokensType } from './../../../interfaces/TokensType';
import { UserLogged } from './../../../interfaces/UserLogged';
import { JWTTokenService } from './../../../services/jwttoken.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnInit {
  loginForm!: FormGroup;
  @Output() changeMode = new EventEmitter();
  @Input() loginMode!: boolean;
  user$ = new BehaviorSubject<UserLogged | null>(null);
  session$ = new BehaviorSubject<TokensType | null>(null);
  loggedIn = new BehaviorSubject<UserLogin>({
    username: 'ejdsdan',
    password: '12389',
  });
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private jwtTokenService: JWTTokenService,
    private cookiesService: CookieServiceService,
    private toastr: ToastrService,
    private router: Router
  ) {}

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
  }

  loginHandler() {
    const data = this.loginForm.getRawValue();
    this.authService.login(data);
  }
}
