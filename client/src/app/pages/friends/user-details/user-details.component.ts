import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, map, switchMap } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { Users } from './../../../interfaces/Users';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent implements OnInit, AfterViewInit {
  user!: Users;
  userId!: string | null;
  viewer$!: Observable<Users[]>;
  users!: Users[];

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.user = this.route.snapshot.data['details'];
    this.viewer$ = this.route.paramMap.pipe(
      map((params: string | any) => params.get('id')),
      switchMap((id) =>
        this.userService.getUserProfile(id).pipe(
          map((user) => user.viewer),
          switchMap((viewers) =>
            this.userService.getViewersFromProfile(viewers)
          )
        )
      )
    );
  }
  ngAfterViewInit(): void {}
  getUserDetails() {}
}
