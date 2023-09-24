import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ToastrService } from 'ngx-toastr';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import * as LoginActions from '../actions/login.actions';

@Injectable()
export class LoginEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoginActions.login),
      mergeMap((action) => {
        return this.authService
          .login({ username: action.username, password: action.password })
          .pipe(
            map(({ accessToken, refreshToken }) => {
              this.router.navigate(['/home']);
              this.toastr.success('Login succesfully');
              return LoginActions.loginSuccess({
                accessToken: accessToken,
                refreshToken: refreshToken,
              });
            }),
            catchError((error) => {
              this.toastr.error(error.error.error);
              return of(LoginActions.loginFailure({ error: error.error }));
            })
          );
      })
    )
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoginActions.register),
      mergeMap((action) => {
        return this.authService
          .register({
            firstname: action.firstname,
            lastname: action.lastname,
            username: action.username,
            email: action.email,
            password: action.password,
            profile_picture: action.profile_picture,
            location: action.location,
          })
          .pipe(
            tap((res) => console.log(res)),
            map(({ message }) => {
              this.toastr.success(message);
              return LoginActions.registerSuccess({ message: message });
            }),
            catchError((error) => {
              console.log(error.error);
              this.toastr.error(error.error);
              return of(LoginActions.registerFailure({ error: error.error }));
            })
          );
      })
    )
  );
}
