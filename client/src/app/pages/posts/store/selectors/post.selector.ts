import { createSelector } from '@ngrx/store';
import { AppState } from 'src/app/interfaces/states/AppState';

export const selectFeature = (state: AppState) => state.posts;
export const isLoadingSelector = createSelector(
  selectFeature,
  (state) => state.isLoading
);
export const postSelector = createSelector(
  selectFeature,
  (state) => state.posts.results
);
export const currentLengthtSelector = createSelector(
  selectFeature,
  (state) => state.posts.results.length
);
export const allPostslengthtSelector = createSelector(
  selectFeature,
  (state) => state.posts.len
);
export const errorsSelector = createSelector(
  selectFeature,
  (state) => state.error
);
