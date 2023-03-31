import { Injectable } from '@angular/core';
import { JWTTokenService } from './jwttoken.service';

@Injectable({
  providedIn: 'root',
})
export class CookieServiceService {
  private cookieStore = {};
  decodedToken!: { [key: string]: string };
  public cookies = [];
  // cookie = document.cookie?.['refresh_token'];
  constructor(private jwtService: JWTTokenService) {}

  getUserDetails(cookies = document.cookie) {
    this.cookieStore = {};
    if (!!cookies === false) {
      return;
    }
    const cookiesArr = cookies.split(';');
    const values = cookiesArr[0].split('=');
    return this.jwtService.decodeToken(values[1]);
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
