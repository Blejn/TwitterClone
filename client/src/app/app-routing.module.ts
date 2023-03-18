import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { ProfileComponent } from './pages/profile/profile.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full', //przekierowanie całościowe
  },
  {
    path: 'home',
    component: HomeComponent,
  },

  {
    path: 'profile',
    component: ProfileComponent,
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
      // enableTracing: true, //do opcji debugowania,
      // initialNavigation: 'disabled',
      //czy router ma sie na starcie uruchomić
      // useHash: true,
      //zeby recznie zmieniac routing bez paska
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
