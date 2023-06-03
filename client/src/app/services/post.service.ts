import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, empty, retry, share } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Post } from '../interfaces/Post';

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
}
