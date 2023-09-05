import { createAction, props } from '@ngrx/store';

export const getLanguage = createAction('[Language] Get language');
export const getLanguageSuccessed = createAction(
  '[Language] Get language successfull'
);
export const getLanguageFailed = createAction(
  '[Language] Set language failed',
  props<{ error: string }>()
);

export const setLanguage = createAction(
  '[Language] Set Language',
  props<{ language: string }>()
);
export const setLanguageSuccessed = createAction(
  '[Language] Set language successfull',
  props<{ language: string }>()
);
export const setLanguageFailed = createAction(
  '[Language] Set language failed',
  props<{ error: string }>()
);
