import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { AvatarModule } from 'ngx-avatar';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreatorComponent } from './creator/creator.component';
import { MapComponent } from './creator/map/map.component';
import { NavComponent } from './nav/nav.component';
import { PostComponent } from './posts-list/post/post.component';
import { PostsListComponent } from './posts-list/posts-list.component';
import { PostsRoutingModule } from './posts-routing.module';
import { PostsComponent } from './posts.component';
import { PostEffects } from './store/effects/post.effect';
import { reducers } from './store/reducers/post.reducers';
const avatarColors = ['#B8B8B8'];

@NgModule({
  declarations: [
    PostsComponent,
    NavComponent,
    CreatorComponent,
    PostsListComponent,
    PostComponent,
    MapComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    PickerModule,
    GoogleMapsModule,
    HttpClientModule,
    AvatarModule.forRoot({
      colors: avatarColors,
    }),
    PostsRoutingModule,
    ReactiveFormsModule,
    TranslateModule,

    StoreModule.forFeature('posts', reducers),
    EffectsModule.forFeature([PostEffects]),
    NgxSkeletonLoaderModule,
  ],
  providers: [AuthGuard],
})
export class PostsModule {}
