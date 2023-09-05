import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FriendsComponent } from './friends.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { UserDetailsResolve } from './user-details/user-details.resolve';
const routes: Routes = [
  {
    path: '',
    component: FriendsComponent,
    children: [],
  },
  {
    path: 'friend/:id',
    component: UserDetailsComponent,
    resolve: {
      details: UserDetailsResolve,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FriendsRoutingModule {}
