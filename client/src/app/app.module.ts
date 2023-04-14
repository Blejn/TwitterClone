import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { HttprequestInterceptor } from './interceptor/httprequest.interceptor';
import { FriendsModule } from './pages/friends/friends.module';
import { LoginModule } from './pages/login/login.module';
import { PostsModule } from './pages/posts/posts.module';

import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AvatarModule } from 'ngx-avatar';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './pages/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginRoutingModule } from './pages/login/login-routing.module';
import { NavbarComponent } from './pages/navbar/navbar.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { PostsRoutingModule } from './pages/posts/posts-routing.module';
import { ProfileComponent } from './pages/profile/profile.component';
import { JWTTokenService } from './services/jwttoken.service';
import { SharedModule } from './shared/shared.module';
const avatarColors = ['#B8B8B8'];
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    ProfileComponent,
    PageNotFoundComponent,
    FooterComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,

    SharedModule,
    LoginModule,
    LoginRoutingModule,
    PostsModule,
    PostsRoutingModule,
    FriendsModule,
    AppRoutingModule,
    AvatarModule.forRoot({
      colors: avatarColors,
    }),
    BrowserAnimationsModule, // KOLEJNOŚĆ MA ZNACZNIE BO NP WCZYTA SIE INNY PATH NIZ POWINIEN
    ToastrModule.forRoot(),
  ],
  providers: [
    JWTTokenService,
    AuthService,
    UserService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttprequestInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
