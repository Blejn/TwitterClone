import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ToastrService } from 'ngx-toastr';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { CommentForm } from 'src/app/interfaces/CommentForm';
import { PostService } from 'src/app/services/post.service';
import * as PostsActions from '../actions/post.actions';

interface ResponseDelete {
  id: string;
  postid: string;
}

@Injectable()
export class PostEffects {
  public state: any = {
    data: '',
    page: 1,
    limit: 3,
  };
  constructor(
    private actions$: Actions,
    private postService: PostService,
    private toastr: ToastrService
  ) {}

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
            map(() =>
              PostsActions.addCommentToPostSuccess({
                id: action.id,
                userId: action.userId,
                username: action.username,
                comment: action.comment,
                postId: action.postId,
              })
            ),
            catchError((error) => {
              this.toastr.error(error.error);
              return of(PostsActions.addCommentToPostFailed(error));
            })
          );
      })
    )
  );

  deleteComment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PostsActions.deleteCommentFromPost),
      mergeMap((action: CommentForm) => {
        return this.postService
          .deleteCommentFromPost(
            action.id,
            action.userId,
            action.username,
            action.comment,
            action.postId
          )
          .pipe(
            map((res: ResponseDelete) => {
              this.toastr.success(res.message);
              return PostsActions.deleteCommentFromPostSuccess({
                id: res.id,
                postId: res.postid,
              });
            }),
            catchError((error) => {
              this.toastr.error(error.error);
              return of(PostsActions.deleteCommentFromPosttFailed(error));
            })
          );
      })
    )
  );
}
