import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Users } from 'src/app/interfaces/Users';

@Component({
  selector: '[app-viewer]',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss'],
})
export class ViewerComponent implements OnInit {
  @Input()
  viewer!: Users;

  constructor(private router: Router) {}

  ngOnInit(): void {}
  navigateToFriendId() {
    this.router.navigate(['/friend/' + this.viewer.id]);
  }
}
