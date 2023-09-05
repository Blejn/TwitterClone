import { createAction, props } from '@ngrx/store';

export const login = createAction(
  '[Auth] Login',
  props<{ username: string; password: string }>()
);
export const loginSuccess = createAction(
  '[Auth] Login success',

  props<{ user: any }>
);

export const loginFailed = createAction(
  '[Auth] Login failed',
  props<{ error: string }>
);
