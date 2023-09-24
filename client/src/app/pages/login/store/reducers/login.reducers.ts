import { createReducer, on } from '@ngrx/store';
import jwtDecode from 'jwt-decode';
import { AuthStateInterface } from 'src/app/interfaces/states/AuthStateInterface';
import { CookieServiceService } from 'src/app/services/cookie-service.service';
import * as LoginActions from '../actions/login.actions';
import { JWTTokenService } from './../../../../services/jwttoken.service';

const jwtService = new JWTTokenService();
const cookieService = new CookieServiceService(jwtService);
const initialState: AuthStateInterface = {
  message: '',
  isLoading: false,
  isLoggedin: cookieService.getUserDetails() != null ? true : false,
  userInfo:
    getTokenFromCookie(cookieService) != null
      ? cookieService.getUserDetails()
      : null,
  accessToken: getTokenFromCookie(cookieService)?.accessToken
    ? getTokenFromCookie(cookieService)?.accessToken
    : null,
  refreshToken: getTokenFromCookie(cookieService)?.refreshToken
    ? getTokenFromCookie(cookieService)?.refreshToken
    : null,
  error: null,
};

function getTokenFromCookie(
  cookieService: CookieServiceService
): { accessToken: string; refreshToken: string } | null {
  try {
    const { accessToken, refreshToken } = cookieService.getTokens();
    return { accessToken, refreshToken };
  } catch (error) {
    return null;
  }
}

export const loginReducers = createReducer(
  initialState,
  on(LoginActions.login, (state: any) => {
    return { ...state, isLoading: true };
  }),
  on(LoginActions.loginSuccess, (state: any, action: any) => {
    return {
      ...state,
      isLoggedin: true,
      userInfo: jwtDecode(action.accessToken),
      accessToken: action.accessToken,
      refreshToken: action.refreshToken,
      isLoading: false,
    };
  }),
  on(LoginActions.loginFailure, (state: any, action: any) => {
    return { ...state, error: action.error, isLoading: false };
  }),
  on(LoginActions.register, (state: any) => {
    return { ...state, isLoading: true };
  }),
  on(LoginActions.registerSuccess, (state: any, action: any) => {
    return {
      ...state,
      message: action,
    };
  }),
  on(LoginActions.registerFailure, (state: any, action: any) => {
    return {
      ...state,
      error: action.error,
    };
  })
);
