import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
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
export class AuthService {
  private apiUrl = '/auth';
  private _isLoggedIn = new BehaviorSubject<boolean>(false);
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

  // authState = this.user$.pipe(
  //   map((user$) => !!user$),
  //   tap((authState) => (this.isAuthenticated = authState))
  // );

  isUserLogged() {
    if (this.cookieService.getUserDetails() !== undefined) {
      this._isLoggedIn.next(true);
    } else {
      this._isLoggedIn.next(false);
    }
  }
  // FUNCTION FOR REGISTRATION
  register(data: UserRegister): Observable<UserRegister> {
    return this.http.post<UserRegister>(
      environment.API_URL + this.apiUrl + '/user/register',
      data,
      { withCredentials: true }
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
  login(data: UserLogin) {
    return this.http
      .post<UserLogin>(
        environment.API_URL + this.apiUrl + '/user/login',
        data,
        {
          withCredentials: true,
        }
      )
      .subscribe((tokens: any) => {
        let user = this.jwtTokenService.decodeToken(tokens?.['refreshToken']);
        this.router.navigate(['/home']);
        this._isLoggedIn.next(true);
        this.isUserLogged();

        this.session$.next(tokens);
        this.toastr.success('Login succesfully');

        // this.user$.next(user);
      });
  }

  logout(message?: string) {
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
  //FUNCTION FOR GET ALL USERS TO ASYNC VALIDATE
}
