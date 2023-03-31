import {
  Component,
  Input,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { Users } from './../../../interfaces/Users';
import { UserListCardComponent } from './../user-list-card/user-list-card.component';

@Component({
  selector: 'app-all-users-section',
  templateUrl: './all-users-section.component.html',
  styleUrls: ['./all-users-section.component.scss'],
})
export class AllUsersSectionComponent implements OnInit {
  @Input()
  users!: Users[];
  @ViewChildren(UserListCardComponent)
  userElement!: QueryList<UserListCardComponent>;

  constructor() {}

  ngOnInit(): void {
    console.log(this.users);
  }
}
