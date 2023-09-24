import { NgModule } from '@angular/core';
import {
  PreloadingStrategy,
  Route,
  RouterModule,
  Routes,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthGuard } from './guards/auth.guard';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
export class CustomPreload implements PreloadingStrategy {
  preload(route: Route, fn: () => Observable<any>): Observable<any> {
    return route.data && route.data['preload'] ? fn() : of(null);
  }
}
const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full', //przekierowanie całościowe
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'posts',
    data: { preload: false },
    canLoad: [AuthGuard],
    loadChildren: () =>
      import('./pages/posts/posts.module').then((m) => m.PostsModule),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'friends',
    loadChildren: () =>
      import('./pages/friends/friends.module').then((m) => m.FriendsModule),
  },
  {
    path: 'not-found',
    component: PageNotFoundComponent,
  },
  {
    path: '**',
    redirectTo: 'not-found',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: CustomPreload,
      // enableTracing: true, //do opcji debugowania,
      // initialNavigation: 'disabled',
      //czy router ma sie na starcie uruchomić
      // useHash: true,
      //zeby recznie zmieniac routing bez paska
    }),
  ],
  exports: [RouterModule],
  providers: [CustomPreload],
})
export class AppRoutingModule {}
