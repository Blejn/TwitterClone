import { createAction, props } from '@ngrx/store';

export const login = createAction(
  '[Auth] Login',
  props<{ username: string; password: string }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ accessToken: string; refreshToken: string }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failed',
  props<{ error: string }>()
);

export const register = createAction(
  '[Auth] Register',
  props<{
    firstname: string;
    lastname: string;
    email: string;
    username: string;
    password: string;
    location: string;
    profile_picture: string;
    observer: [];
    posts: [];
    viewer: [];
  }>()
);
export const registerSuccess = createAction(
  '[Auth] Register Success',
  props<{
    message: string;
  }>()
);
export const registerFailure = createAction(
  '[Auth] Register Failed',
  props<{ error: string }>()
);
