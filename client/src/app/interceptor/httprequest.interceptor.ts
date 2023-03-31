import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, empty, Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CookieServiceService } from './../services/cookie-service.service';

@Injectable({
  providedIn: 'root',
})
export class HttprequestInterceptor implements HttpInterceptor {
  constructor(
    private cookieService: CookieServiceService,
    private authService: AuthService
  ) {}

  intercept(
    request: HttpRequest<any | unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<any | unknown>> {
    let authReq = request;

    const token = this.cookieService;
    if (token !== null) {
      authReq = request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + this.cookieService.getAccessToken(),
        },
      });
    }

    return next.handle(authReq).pipe(
      catchError((err, caught) => {
        if (err instanceof HttpErrorResponse && err.status === 403) {
          // this.authService.logout();   Dodam jak będzie GUARD
        }
        return empty();
      })
    );
  }
}
