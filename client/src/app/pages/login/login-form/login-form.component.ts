import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { UserLogin } from 'src/app/interfaces/UserLogin';
import { AppState } from 'src/app/interfaces/states/AppState';
import { AuthService } from 'src/app/services/auth.service';
import { TokensType } from './../../../interfaces/TokensType';
import { UserLogged } from './../../../interfaces/UserLogged';
import { login } from './../store/actions/login.actions';

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
    private toastr: ToastrService,
    private router: Router,
    private store: Store<AppState>
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
    this.authService.login(data).subscribe((tokens: any) => {
      this.store.dispatch(login(data));
      this.router.navigate(['/home']);
      this.authService._isLoggedIn.next(true);
      this.authService.isUserLogged();
      this.session$.next(tokens);
      this.toastr.success('Login succesfully');
    });
  }
}
