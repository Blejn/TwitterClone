import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import { Users } from './../../interfaces/Users';
import { AllUsersSectionComponent } from './all-users-section/all-users-section.component';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss'],
})
export class FriendsComponent implements OnInit, AfterViewInit {
  @ViewChild(AllUsersSectionComponent)
  usersComponents!: AllUsersSectionComponent;

  constructor(
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService
  ) {}
  pageEvent!: PageEvent;
  users!: Users[];
  search!: string;
  page = '1';
  limit = '1';
  state = { allElementsLength: 0, pageSizeOptions: [3, 6], pageSize: 3 };

  @ViewChild('searchBar') searchBar: ElementRef | undefined;
  ngOnInit(): void {
    this.getProfiles();
  }
  ngAfterViewInit(): void {
    // setTimeout(() => {
    //   this.usersComponents.userElement.forEach((el) => {
    //     console.log(el);
    //   });
    // }, 100);
  }
  getProfiles() {
    this.userService.data$('', '1', '3').subscribe({
      next: (response) => (
        (this.users = [...response.results]),
        (this.state.allElementsLength = response.len)
      ),
      error: (error) => console.log(error.message),
    });
  }

  searchData(event: any) {
    this.search = event.target.value;
    this.userService
      .getUsers(this.search, this.page, String(this.state.allElementsLength))
      .subscribe({
        next: (response) => (
          (this.users = [...response.results]),
          (this.state.allElementsLength = response.len)
        ),
        error: (error) => console.log(error.message),
      });
  }

  searchDataPagination(event: PageEvent) {
    this.search = '';
    this.userService
      .getUsers(
        this.search,
        String(event.pageIndex + 1),
        String(event.pageSize)
      )
      .subscribe({
        next: (response) => (this.users = [...response.results]),
        // , (this.state.allElementsLength = response.len)
        error: (error) => console.log(error.message),
      });
  }
}
