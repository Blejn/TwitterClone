import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { AvatarModule } from 'ngx-avatar';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreatorComponent } from './creator/creator.component';
import { NavComponent } from './nav/nav.component';
import { PostComponent } from './posts-list/post/post.component';
import { PostsListComponent } from './posts-list/posts-list.component';
import { PostsRoutingModule } from './posts-routing.module';
import { PostsComponent } from './posts.component';
const avatarColors = ['#B8B8B8'];

@NgModule({
  declarations: [
    PostsComponent,
    NavComponent,
    CreatorComponent,
    PostsListComponent,
    PostComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    AvatarModule.forRoot({
      colors: avatarColors,
    }),
    PostsRoutingModule,
    ReactiveFormsModule,
  ],
})
export class PostsModule {}
