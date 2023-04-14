import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { CookieServiceService } from 'src/app/services/cookie-service.service';
import { UserService } from 'src/app/services/user.service';
import { UserLogged } from './../../interfaces/UserLogged';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  // private user_request!: Observable<UserLogged | null>;
  isUserLogged!: boolean;
  public username!: string;
  avatarLogoLetter!: string;
  user: UserLogged = {
    id: '',
    username: '',
    email: '',
  };
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private cookieService: CookieServiceService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.authService.isLoggedIn.subscribe(
      (value) => (this.isUserLogged = value)
    );

    this.getUserLogged();

    // this.getUserProfile();
  }

  getUserLogged() {
    if (this.isUserLogged) {
      this.user = Object.assign(this.user, this.cookieService.getUserDetails());
      this.avatarLogoLetter = this.user.username.split('')[0];
    } else {
      return;
    }
  }

  // getUserProfile() {
  //   if (!this.user_request) {
  //     this.user_request = this.authService.authState.pipe(
  //       filter(() => this.authService.isAuthenticated),
  //       map(() => this.authService.getCurrentUser())
  //     );
  //   }
  //   return this.user_request;
  // }

  //TUTAJ JEST PROFILI BO TRZEBA ACCESS TOKEN DODAC
  navigation(route: string) {
    this.router.navigate([`${route}`]);
  }

  logout() {
    this.authService.logout();
  }
}
