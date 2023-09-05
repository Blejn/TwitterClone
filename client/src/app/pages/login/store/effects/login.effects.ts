import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import * as LoginActions from '../actions/login.actions';

@Injectable()
export class LoginEffects {
  constructor(private actions$: Actions, private authService: AuthService) {}

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoginActions.login),
      mergeMap((action) =>
        this.authService
          .login({ username: action.username, password: action.password })
          .pipe(
            map((user) => LoginActions.loginSuccess()),
            catchError((error) => of(LoginActions.loginFailed()))
          )
      )
    )
  );
}
