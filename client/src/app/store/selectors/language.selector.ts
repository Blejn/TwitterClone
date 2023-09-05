import { createSelector } from '@ngrx/store';
import { AppState } from 'src/app/interfaces/states/AppState';

export const selectFeature = (state: AppState) => state.language;
export const currentLanguage = createSelector(
  selectFeature,
  (state) => state.language
);
