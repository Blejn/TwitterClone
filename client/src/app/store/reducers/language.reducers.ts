import { createReducer, on } from '@ngrx/store';
import * as LanguageActions from '../actions/language.actions';
import { LanguageStateInterface } from './../../interfaces/states/LanguageStateInterface';
export const initialState: LanguageStateInterface = {
  isLoading: false,
  language: 'en',
  error: null,
};

export const languageReducers = createReducer(
  initialState,
  on(LanguageActions.getLanguage, (state) => ({ ...state, isLoading: true })),

  on(LanguageActions.getLanguageSuccessed, (state) => ({
    ...state,
    language: localStorage.getItem('language')
      ? localStorage.getItem('language') || 'en'
      : 'en',
  })),

  on(LanguageActions.getLanguageFailed, (state, action) => ({
    ...state,
    isLoading: false,
    error: action.error,
  })),
  on(LanguageActions.setLanguage, (state, action) => ({
    ...state,
    isLoading: false,
    language: action.language,
  }))
);
