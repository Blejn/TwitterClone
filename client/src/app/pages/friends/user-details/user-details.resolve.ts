import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Users } from 'src/app/interfaces/Users';
import { UserService } from 'src/app/services/user.service';
@Injectable()
export class UserDetailsResolve implements Resolve<Users> {
  constructor(private userService: UserService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.userService.getUserProfile(route.params['id']);
  }
}
