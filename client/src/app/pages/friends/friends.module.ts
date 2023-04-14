import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AvatarModule } from 'ngx-avatar';
import { SharedModule } from './../../shared/shared.module';
import { AllUsersSectionComponent } from './all-users-section/all-users-section.component';
import { FriendsRoutingModule } from './friends-routing.module';
import { FriendsSectionComponent } from './friends-section/friends-section.component';
import { FriendsComponent } from './friends.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { UserListCardComponent } from './user-list-card/user-list-card.component';
import { ViewerComponent } from './user-details/viewer/viewer.component';
const avatarColors = ['#B8B8B8'];

@NgModule({
  declarations: [
    FriendsComponent,
    FriendsSectionComponent,
    AllUsersSectionComponent,
    UserDetailsComponent,
    UserListCardComponent,
    ViewerComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    AvatarModule.forRoot({
      colors: avatarColors,
    }),
    FriendsRoutingModule,
  ],
})
export class FriendsModule {}
