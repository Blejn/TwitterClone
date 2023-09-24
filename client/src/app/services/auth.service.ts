import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, catchError, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserLogin } from '../interfaces/UserLogin';
import { UserRegister } from '../interfaces/UserRegister';
import { TokensType } from './../interfaces/TokensType';
import { Username } from './../interfaces/Usernames';
import { CookieServiceService } from './cookie-service.service';
import { JWTTokenService } from './jwttoken.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnInit {
  private apiUrl = '/auth';
  public _isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  session$ = new BehaviorSubject<TokensType | null>(null);
  private isAuthenticated!: boolean;

  constructor(
    private http: HttpClient,
    private jwtTokenService: JWTTokenService,
    private router: Router,
    private cookieService: CookieServiceService,
    private toastr: ToastrService
  ) {
    this.isUserLogged();
  }

  ngOnInit(): void {
    this.isUserLogged();
  }

  isUserLogged() {
    if (this.cookieService.getUserDetails() !== undefined) {
      this._isLoggedIn.next(true);
    } else {
      this._isLoggedIn.next(false);
    }
  }

  checkUserLogin(): any {
    return of(this._isLoggedIn);
  }
  // FUNCTION FOR REGISTRATION
  register(data: UserRegister): Observable<{ message: string }> {
    const formData = new FormData();

    // Dodaj dane do formularza
    formData.append('firstname', data.firstname);
    formData.append('lastname', data.lastname);
    formData.append('email', data.email);
    formData.append('username', data.username);
    formData.append('password', data.password);
    formData.append('location', data.location);

    // Dodaj obrazek profilowy (profile_picture)
    if (data.profile_picture) {
      formData.append('profile_picture', data.profile_picture);
    }

    return this.http.post<{ message: string }>(
      environment.API_URL + this.apiUrl + '/user/register',
      formData,
      {
        withCredentials: true,
      }
    );
  }

  getAllUsers(): Observable<Username[]> {
    return this.http.get<Username[]>(
      environment.API_URL + this.apiUrl + '/all/usernames'
    );
  }

  get isLoggedIn() {
    return this._isLoggedIn.asObservable();
  }
  login(
    data: UserLogin
  ): Observable<{ accessToken: string; refreshToken: string }> {
    return this.http
      .post<{ accessToken: string; refreshToken: string }>(
        environment.API_URL + this.apiUrl + '/user/login',
        data,
        {
          withCredentials: true,
        }
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error);
          if (error.status === 401) {
            // Niepoprawne dane logowania, rzuć odpowiedni błąd
            return throwError(() => error);
          } else {
            // Inny błąd, rzuć go dalej
            return throwError(() => error);
          }
        })
      );
  }

  logout() {
    return this.http
      .delete(environment.API_URL + '/delete/refresh_token', {
        withCredentials: true,
      })
      .subscribe({
        next: (data: any) => {
          this.router.navigate(['/login']);
          this._isLoggedIn.next(false);
          this.isUserLogged();
          this.toastr.success('Logout succesfully');
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  private handleError(err: any) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }

  //FUNCTION FOR GET ALL USERS TO ASYNC VALIDATE
}
