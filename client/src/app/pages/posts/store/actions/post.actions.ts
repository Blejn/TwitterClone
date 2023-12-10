import { createAction, props } from '@ngrx/store';
import { PostResult } from 'src/app/interfaces/states/PostsStateInterface';

export const getPosts = createAction('[Posts] Get posts');
export const getPostsSuccessed = createAction(
  '[Posts] Get posts successed',
  props<{ posts: PostResult }>()
);
export const getPostsFailed = createAction(
  '[Posts] Get posts failed',
  props<{ error: string }>()
);

export const getMorePosts = createAction('[Posts] Get more posts');
export const getMorePostsSuccessed = createAction(
  '[Posts] Get more posts successed',
  props<{ posts: PostResult }>()
);
export const getMorePostsFailed = createAction(
  '[Posts] Get more posts failed',
  props<{ error: string }>()
);

export const addReactionToPost = createAction(
  '[Posts] Add reaction',
  props<{ postId: string; userId: string }>()
);
export const addReactionSuccessed = createAction(
  '[Posts] Add reaction successed',
  props<{ postId: string; userId: string }>()
);
export const addReactionFailed = createAction(
  '[Posts] Add reaction failed',
  props<{ error: string }>()
);

export const removeReactionFromPost = createAction(
  '[Posts] Remove reaction',
  props<{ postId: string; userId: string }>()
);
export const removeReactionFromPostSuccess = createAction(
  '[Posts] Remove reaction success',
  props<{ postId: string; userId: string }>()
);
export const removeReactionFromPostFailed = createAction(
  '[Posts] Remove reaction failed',
  props<{ error: string }>()
);

export const addCommentToPost = createAction(
  '[Posts] Add comment ',
  props<{
    id: string;
    userId: string;
    username: string;
    comment: string;
    postId: string;
  }>()
);
export const addCommentToPostSuccess = createAction(
  '[Posts] Add comment success',
  props<{
    id: string;
    userId: string;
    username: string;
    comment: string;
    postId: string;
  }>()
);
export const addCommentToPostFailed = createAction(
  '[Posts] Add comment failed',
  props<{ error: string }>()
);

export const deleteCommentFromPost = createAction(
  '[Posts] Delete comment',
  props<{
    id: string;
    userId: string;
    username: string;
    comment: string;
    postId: string;
  }>()
);
export const deleteCommentFromPostSuccess = createAction(
  '[Posts] Delete comment success',
  props<{
    id: string;
    postId: string;
  }>()
);
export const deleteCommentFromPosttFailed = createAction(
  '[Posts] Delete comment failed',
  props<{ error: string }>()
);
