import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserLogged } from '../interfaces/UserLogged';
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
  user$ = new BehaviorSubject<UserLogged | null>(null);
  session$ = new BehaviorSubject<TokensType | null>(null);
  private isAuthenticated!: boolean;
  constructor(
    private http: HttpClient,
    private jwtTokenService: JWTTokenService,
    private router: Router,
    private cookieService: CookieServiceService
  ) {
    this.isUserLogged();
  }

  // authState = this.user$.pipe(
  //   map((user$) => !!user$),
  //   tap((authState) => (this.isAuthenticated = authState))
  // );

  isUserLogged() {
    if (this.cookieService.getUserDetails() !== undefined) {
      return true;
    } else {
      return false;
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
        window.location.reload();

        this.session$.next(tokens);
        // this.user$.next(user);
        console.log(this.session$.getValue());
        console.log(this.user$.getValue());
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
          window.location.reload();
          this.isAuthenticated === true;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }
  //FUNCTION FOR GET ALL USERS TO ASYNC VALIDATE
}
