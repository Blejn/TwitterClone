import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { PostService } from 'src/app/services/post.service';
import * as PostsActions from '../actions/post.actions';
@Injectable()
export class PostEffects {
  public state: any = {
    data: '',
    page: 1,
    limit: 3,
  };
  constructor(private actions$: Actions, private postService: PostService) {}

  getPosts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PostsActions.getPosts),
      mergeMap(() => {
        return this.postService
          .getNgPosts('', this.state.page, this.state.limit)
          .pipe(
            map((posts) => PostsActions.getPostsSuccessed({ posts })),
            catchError((error) =>
              of(PostsActions.getPostsFailed({ error: error.message }))
            )
          );
      })
    )
  );

  getMorePosts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PostsActions.getMorePosts),
      mergeMap(() => {
        return this.postService.getMoreNgPosts('', 2, 3).pipe(
          map((posts) => PostsActions.getMorePostsSuccessed({ posts })),
          catchError((error) =>
            of(PostsActions.getMorePostsFailed({ error: error.message }))
          )
        );
      })
    )
  );

  addReaction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PostsActions.addReactionToPost),
      mergeMap((action) => {
        return this.postService
          .addReactionToPost(action.userId, action.postId)
          .pipe(
            map(() =>
              PostsActions.addReactionSuccessed({
                postId: action.postId,
                userId: action.userId,
              })
            ),
            catchError((error) => of(PostsActions.addReactionFailed(error)))
          );
      })
    )
  );

  deleteReaction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PostsActions.removeReactionFromPost),
      mergeMap((action) => {
        return this.postService
          .deleteReactionFromPost(action.userId, action.postId)
          .pipe(
            tap((res) => console.log(res)),
            map(() =>
              PostsActions.removeReactionFromPostSuccess({
                postId: action.postId,
                userId: action.userId,
              })
            ),
            catchError((error) =>
              of(PostsActions.removeReactionFromPostFailed(error))
            )
          );
      })
    )
  );

  addComment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PostsActions.addCommentToPost),
      mergeMap((action) => {
        return this.postService
          .addComment(
            {
              id: action.id,
              userId: action.userId,
              username: action.username,
              comment: action.comment,
              postId: action.postId,
            },
            action.postId
          )
          .pipe(
            tap((res) => console.log(res)),
            map(() =>
              PostsActions.addCommentToPostSuccess({
                id: action.id,
                userId: action.userId,
                username: action.username,
                comment: action.comment,
                postId: action.postId,
              })
            ),
            catchError((error) =>
              of(PostsActions.addCommentToPostFailed(error))
            )
          );
      })
    )
  );
}
