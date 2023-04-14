import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FriendsComponent } from './friends.component';
import { UserDetailsComponent } from './user-details/user-details.component';
const routes: Routes = [
  {
    path: 'friends',
    component: FriendsComponent,
  },
  {
    path: 'friend/:id',
    component: UserDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FriendsRoutingModule {}
