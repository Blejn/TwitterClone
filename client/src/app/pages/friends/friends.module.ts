import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AvatarModule } from 'ngx-avatar';
import { HttprequestInterceptor } from 'src/app/interceptor/httprequest.interceptor';
import { UserService } from 'src/app/services/user.service';
import { SharedModule } from './../../shared/shared.module';
import { AllUsersSectionComponent } from './all-users-section/all-users-section.component';
import { FriendsRoutingModule } from './friends-routing.module';
import { FriendsSectionComponent } from './friends-section/friends-section.component';
import { FriendsComponent } from './friends.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { UserDetailsResolve } from './user-details/user-details.resolve';
import { ViewerComponent } from './user-details/viewer/viewer.component';
import { UserListCardComponent } from './user-list-card/user-list-card.component';
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
    TranslateModule,
  ],
  providers: [
    UserService,
    UserDetailsResolve,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttprequestInterceptor,
      multi: true,
    },
  ],
})
export class FriendsModule {}
