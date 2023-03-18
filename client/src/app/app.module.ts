import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LoginModule } from './pages/login/login.module';
import { PostsModule } from './pages/posts/posts.module';

import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginRoutingModule } from './pages/login/login-routing.module';
import { NavbarComponent } from './pages/navbar/navbar.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { PostsRoutingModule } from './pages/posts/posts-routing.module';
import { ProfileComponent } from './pages/profile/profile.component';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,

    NavbarComponent,
    HomeComponent,
    ProfileComponent,
    PageNotFoundComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    SharedModule,
    LoginModule,
    LoginRoutingModule,
    PostsModule,
    PostsRoutingModule,
    AppRoutingModule,
    BrowserAnimationsModule, // KOLEJNOŚĆ MA ZNACZNIE BO NP WCZYTA SIE INNY PATH NIZ POWINIEN
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
