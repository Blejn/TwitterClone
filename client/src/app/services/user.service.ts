import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, Observable, catchError, empty, share } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import { Data } from '../interfaces/Data';
import { Users } from '../interfaces/Users';
import { CookieServiceService } from './cookie-service.service';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = '/users';

  constructor(
    private httpService: HttpClient,
    private cookieService: CookieServiceService,
    private router: Router,
    private authService: AuthService
  ) {}
  data$ = (data: string, page: string, limit: string) => {
    return this.httpService
      .get<Data>(
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
        share(),
        catchError((err) => {
          if (err instanceof HttpErrorResponse) {
            throw new Error('Not authorized! Please log in');
          }
          return empty();
        })
      );
  };

  followNewUser(
    currentUserId: string,
    friendId: string
  ): Observable<{ id: string }> {
    return this.httpService
      .post<{ id: string }>(
        environment.API_URL + this.apiUrl + '/viewer/' + friendId,
        { id: currentUserId },
        {
          withCredentials: true,
        }
      )
      .pipe(
        share(),
        catchError((error) => {
          if (error instanceof HttpErrorResponse) {
            throw new Error('Not authorized');
          }
          return empty();
        })
      );
  }

  getUserProfile(id: string | null) {
    return this.httpService
      .get<Users>(environment.API_URL + this.apiUrl + '/' + id)
      .pipe(
        catchError((error) => {
          if (error instanceof HttpErrorResponse) {
            throw new Error('Not authorized');
          }
          return empty();
        })
      );
  }

  getViewersFromProfile(ids: Array<string> | null): Observable<Users[]> {
    return this.httpService
      .post<Users[]>(
        environment.API_URL + '/specific',
        { ids: ids },
        { withCredentials: true }
      )
      .pipe(
        catchError((error) => {
          if (error instanceof HttpErrorResponse) {
            throw new Error('Not authorized user!');
          }
          return EMPTY;
        })
      );
  }

  getUsers(data: string, page: string, limit: string): Observable<Data> {
    return this.httpService
      .get<Data>(
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
        share(),

        catchError((err) => {
          if (err instanceof HttpErrorResponse) {
            throw new Error('Not authorized! Please log in');
          }
          return empty();
        })
      );
  }
}
