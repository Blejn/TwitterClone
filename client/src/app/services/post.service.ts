import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, empty, retry, share } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CommentForm } from '../interfaces/CommentForm';
import { Post } from '../interfaces/Post';
import { PostResult } from '../interfaces/states/PostsStateInterface';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  public posts: Post[] = [];
  private apiUrl = '/posts';

  constructor(private httpService: HttpClient) {}

  addNewPosts(data: string, page: number, limit: number) {
    this.getPosts(data, page + 1, limit).subscribe((newPosts: Post[]) => {
      this.posts.push(...newPosts);
    });
  }
  getMoreNgPosts(data: string, page: number, limit: number) {
    return this.getNgPosts(data, page, limit);
  }
  addPost = (post: Post): Observable<Post> => {
    return this.httpService
      .post<Post>(environment.API_URL + '/createPost', post)
      .pipe(
        retry(2),
        share(),
        catchError((error) => {
          if (error instanceof HttpErrorResponse) {
            throw new Error('Not authorized, Please log in');
          }

          return empty();
        })
      );
  };
  getPosts = (
    data: string,
    page: number,
    limit: number
  ): Observable<Post[]> => {
    return this.httpService
      .get<Post[]>(
        environment.API_URL +
          this.apiUrl +
          '?search=' +
          data +
          '&page=' +
          page +
          '&limit=' +
          limit
      )
      .pipe(
        retry(2),
        share(),
        catchError((error) => {
          if (error instanceof HttpErrorResponse) {
            throw new Error('Not authorized, Please log in');
          }

          return empty();
        })
      );
  };

  addReactionToPost = (userId: string, postId: string): Observable<string> => {
    return this.httpService
      .post<string>(
        environment.API_URL + this.apiUrl + '/' + postId + '/like',
        { userId: userId }
      )
      .pipe(
        retry(2),
        share(),
        catchError((error) => {
          if (error instanceof HttpErrorResponse) {
            throw new Error('Not authorized, Please log in');
          }
          return empty();
        })
      );
  };

  deleteReactionFromPost = (
    userId: string,
    postId: string
  ): Observable<string> => {
    return this.httpService
      .post<string>(
        environment.API_URL + this.apiUrl + '/' + postId + '/dislike',
        {
          userId: userId,
        }
      )
      .pipe(
        retry(2),
        share(),
        catchError((error) => {
          if (error instanceof HttpErrorResponse) {
            throw new Error('Not authorized, Please log in');
          }
          return empty();
        })
      );
  };
  deleteCommentFromPost = (
    id: string,
    userId: string,
    username: string,
    comment: string,
    postId: string
  ): Observable<string> => {
    return this.httpService.post<string>(
      environment.API_URL + this.apiUrl + '/' + postId + '/removeComment',
      {
        id: id,
        userId: userId,
        username: username,
        comment: comment,
      }
    );
  };

  addComment = (
    commentForm: CommentForm,
    postId: string
  ): Observable<string> => {
    return this.httpService
      .post<string>(
        environment.API_URL + this.apiUrl + '/' + postId + '/comments',
        {
          userId: commentForm.userId,
          username: commentForm.username,
          comment: commentForm.comment,
        }
      )
      .pipe(
        retry(2),
        share(),
        catchError((error) => {
          if (error instanceof HttpErrorResponse) {
            throw new Error('Not authorized, Please log in');
          }
          return empty();
        })
      );
  };

  getNgPosts = (
    data: string,
    page: number,
    limit: number
  ): Observable<PostResult> => {
    return this.httpService
      .get<PostResult>(
        environment.API_URL +
          this.apiUrl +
          '?search=' +
          data +
          '&page=' +
          page +
          '&limit=' +
          limit
      )
      .pipe(
        retry(2),
        share(),
        catchError((error) => {
          if (error instanceof HttpErrorResponse) {
            throw new Error('Not authorized, Please log in');
          }

          return empty();
        })
      );
  };
}
