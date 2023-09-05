import { Injectable } from '@angular/core';
import { CanActivate, CanLoad } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Injectable()
export class AuthGuard implements CanLoad, CanActivate {
  constructor(private authService: AuthService) {}
  canLoad() {
    return this.authService.checkUserLogin();
  }
  canActivate() {
    console.log(this.authService.checkUserLogin());

    return this.authService.checkUserLogin();
  }
  canAcivateChild() {
    console.log(this.authService.checkUserLogin());

    return this.authService.checkUserLogin();
  }
}
