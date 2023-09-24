import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { Languages } from 'src/app/interfaces/Languages';
import { AppState } from 'src/app/interfaces/states/AppState';
import { AuthService } from 'src/app/services/auth.service';
import { CookieServiceService } from 'src/app/services/cookie-service.service';
import { ThemeService } from 'src/app/services/theme.service';
import { setLanguage } from 'src/app/store/actions/language.actions';
import { userInfo, userLoggedIn } from '../login/store/selectors/auth.selector';
import { UserLogged } from './../../interfaces/UserLogged';
import { currentLanguage } from './../../store/selectors/language.selector';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  currentLanguage$ = this.store.select(currentLanguage);
  auth$ = this.store.select(userLoggedIn);
  currentuserInfo$ = this.store.select(userInfo);
  // private user_request!: Observable<UserLogged | null>;
  @Output() darkMode = new EventEmitter<boolean>();
  isDarkTheme!: Observable<boolean>;
  isUserLogged!: boolean;
  public username!: string;
  avatarLogoLetter!: string;
  user: UserLogged = {
    id: '',
    username: '',
    email: '',
    profile_picture: '',
  };
  currentLanguageApp!: string;
  languages: Languages[] = [
    { language: 'en', languageValue: 'gb', name: 'English' },
    { language: 'pl', languageValue: 'pl', name: 'Polish' },
  ];

  constructor(
    private authService: AuthService,
    private cookieService: CookieServiceService,
    private router: Router,
    private themeService: ThemeService,
    private translate: TranslateService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.currentLanguage$.subscribe(
      (language) => this.currentLanguageApp === language
    );
    this.authService.isLoggedIn.subscribe(
      (value) => (this.isUserLogged = value)
    );
    this.isDarkTheme = this.themeService.isDarkTheme;
    this.getUserLogged();
  }

  toggleDarkTheme(checked: boolean) {
    this.themeService.setDarkTheme(checked);
  }

  getUserLogged() {
    this.auth$.subscribe((res) => {
      if (res) {
        this.currentuserInfo$.subscribe(
          ({ username, email, profile_picture, id }: any) => {
            Object.assign(this.user, { username, email, profile_picture, id });
          }
        );

        this.avatarLogoLetter = this.user.username.split('')[0];
      } else {
        return;
      }
    });
  }

  changeMode() {
    this.darkMode.emit(true);
  }

  switchLanguage() {
    this.translate.use(this.currentLanguageApp);
    this.store.dispatch(setLanguage({ language: this.currentLanguageApp }));
  }

  navigation(route: string) {
    this.router.navigate([`${route}`]);
  }

  logout() {
    this.authService.logout();
  }
}
