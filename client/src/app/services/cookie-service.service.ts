import { Injectable } from '@angular/core';
import { UserDetails } from '../interfaces/UserDetails';
import { UserLogged } from '../interfaces/UserLogged';
import { JWTTokenService } from './jwttoken.service';

@Injectable({
  providedIn: 'root',
})
export class CookieServiceService {
  private cookieStore = {};
  user!: UserLogged | any;
  decodedToken!: { [key: string]: string };
  public cookies = [];
  // cookie = document.cookie?.['refresh_token'];
  constructor(private jwtService: JWTTokenService) {}

  getTokens(): any {
    const cookies = document.cookie.split(';').map((cookie) => cookie.trim());
    let accessToken = null;
    let refreshToken = null;

    for (const cookie of cookies) {
      const [name, value] = cookie
        .split('=')
        .map((cookiePart) => cookiePart.trim());
      if (name == 'access_token') {
        accessToken = value;
      }
      if (name == 'refresh_token') {
        refreshToken = value;
      }
    }
    return { accessToken, refreshToken };
  }

  getUserDetails(cookies = document.cookie): UserDetails | null {
    this.cookieStore = {};
    if (!!cookies === false) {
      return null;
    }
    const cookiesArr = cookies.split(';');
    const values = cookiesArr[0].split('=');
    return this.jwtService.decodeToken(values[1]) as UserDetails;
  }

  getUserId(cookies = document.cookie) {
    this.cookieStore = {};
    if (!!cookies === false) {
      return;
    }
    const cookiesArr = cookies.split(';');
    const values = cookiesArr[0].split('=');
    this.user = this.jwtService.decodeToken(values[1]);
    let id = this.user['id'];
    return id;
  }
  getAccessToken(cookies = document.cookie) {
    this.cookieStore = {};
    if (!!cookies === false) {
      return;
    }
    const cookiesArr = cookies.split(';');
    const values = cookiesArr[1].split('=');
    return values[1];
  }
}
