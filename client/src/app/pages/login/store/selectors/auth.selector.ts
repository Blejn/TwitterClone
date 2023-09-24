import { createSelector } from '@ngrx/store';
import { AppState } from 'src/app/interfaces/states/AppState';
export const selectFeature = (state: AppState) => state.auth;
export const userLoggedIn = createSelector(
  selectFeature,
  (state) => state.isLoggedin
);
export const userInfo = createSelector(
  selectFeature,
  (state) => state.userInfo
);
