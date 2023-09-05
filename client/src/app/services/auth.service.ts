import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, of } from 'rxjs';
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
    return this.http.post<UserLogin>(
      environment.API_URL + this.apiUrl + '/user/login',
      data,
      {
        withCredentials: true,
      }
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
  //FUNCTION FOR GET ALL USERS TO ASYNC VALIDATE
}
