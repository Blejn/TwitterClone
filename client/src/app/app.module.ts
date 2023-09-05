import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { EffectsModule } from '@ngrx/effects';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { HttprequestInterceptor } from './interceptor/httprequest.interceptor';
import { FriendsModule } from './pages/friends/friends.module';
import { LoginModule } from './pages/login/login.module';

import { PostsModule } from './pages/posts/posts.module';

import { CommonModule } from '@angular/common';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CloudinaryModule } from '@cloudinary/ng';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AvatarModule } from 'ngx-avatar';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './pages/footer/footer.component';
import { FriendsRoutingModule } from './pages/friends/friends-routing.module';
import { HomeRoutingModule } from './pages/home/home-routing.module';
import { HomeModule } from './pages/home/home.module';
import { LoginRoutingModule } from './pages/login/login-routing.module';
import { NavbarComponent } from './pages/navbar/navbar.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { PostsRoutingModule } from './pages/posts/posts-routing.module';
import { JWTTokenService } from './services/jwttoken.service';
import { SharedModule } from './shared/shared.module';
import { languageReducers } from './store/reducers/language.reducers';
const avatarColors = ['#B8B8B8'];

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    PageNotFoundComponent,
    FooterComponent,
  ],
  imports: [
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    LoginModule,
    LoginRoutingModule,
    PostsModule,
    PostsRoutingModule,
    FriendsModule,
    FriendsRoutingModule,
    HomeModule,
    HomeRoutingModule,
    AppRoutingModule,
    CloudinaryModule,

    AvatarModule.forRoot({
      colors: avatarColors,
    }),
    BrowserAnimationsModule, // KOLEJNOŚĆ MA ZNACZNIE BO NP WCZYTA SIE INNY PATH NIZ POWINIEN
    ToastrModule.forRoot(),
    HttpClientModule,
    StoreModule.forRoot({
      language: languageReducers,
    }),
    EffectsModule.forRoot(),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      autoPause: true,
    }),
    NgxSkeletonLoaderModule,
  ],
  exports: [TranslateModule],
  providers: [
    JWTTokenService,
    AuthService,
    UserService,
    TranslateService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttprequestInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
