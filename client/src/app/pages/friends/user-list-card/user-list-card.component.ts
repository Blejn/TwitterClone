import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import { Users } from './../../../interfaces/Users';
import { CookieServiceService } from './../../../services/cookie-service.service';

@Component({
  selector: '[app-user-list-card]',
  templateUrl: './user-list-card.component.html',
  styleUrls: ['./user-list-card.component.scss'],
})
export class UserListCardComponent implements OnInit, AfterViewInit {
  isFollow = false;
  currentUser!: string;
  constructor(
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService,
    private cookieService: CookieServiceService
  ) {}
  @Input()
  user!: Users;
  ngOnInit(): void {
    // fromEvent(document, 'click')
    //   .pipe(
    //     shareReplay(),
    //     switchMap(() => interval(1000))
    //   )
    //   .subscribe((res: any) => console.log(res));
    this.isFollowing();
  }
  ngAfterViewInit(): void {}
  navigateToFriendId() {
    this.router.navigate(['/friend/' + this.user.id]);
  }

  followUser() {
    this.isFollow
      ? (this.toastr.success('You unfollow this user'),
        (this.isFollow = !this.isFollow))
      : (this.toastr.success('You follow this user'),
        (this.isFollow = !this.isFollow));
    this.userService
      .followNewUser(this.cookieService.getUserId(), this.user.id)
      .subscribe((res) => console.log(res));
  }
  // getFollowStatus() {
  //   let status!: boolean;
  //   this.isFollow$.subscribe((i) => (status = i));
  //   return status;
  // }
  isFollowing() {
    if (this.user.viewer && this.user.viewer.length) {
      if (this.user.viewer.includes(this.cookieService.getUserId())) {
        this.isFollow = true;
      } else {
        this.isFollow = false;
      }
    } else {
      this.isFollow = false;
    }
  }
}
// TUTAJ MUSZE DAC WARUNEK JESLI FOLOOWUJEMY USERA
