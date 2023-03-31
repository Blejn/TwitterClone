import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, empty, share } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import { Data } from '../interfaces/Data';
import { CookieServiceService } from './cookie-service.service';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = '/users';
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

  constructor(
    private httpService: HttpClient,
    private cookieService: CookieServiceService,
    private router: Router,
    private authService: AuthService
  ) {}
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
