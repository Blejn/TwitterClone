import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Users } from 'src/app/interfaces/Users';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: '[app-viewer]',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss'],
})
export class ViewerComponent implements OnInit {
  @Input()
  viewer!: Users;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    console.log(this.viewer);
  }
  navigateToFriendId() {
    this.router.navigate(['/friend/' + this.viewer.id]);
  }
}
