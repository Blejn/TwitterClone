import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
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

    const token = this.cookieService.getAccessToken();
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
          return throwError(() => err);
        } else {
        }
        return throwError(() => err);
      })
    );
  }
}
