import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { CookieServiceService } from 'src/app/services/cookie-service.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { LoginFormComponent } from './login-form/login-form.component';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { RegisterFormComponent } from './register-form/register-form.component';
import { LoginEffects } from './store/effects/login.effects';
import { loginReducers } from './store/reducers/login.reducers';

@NgModule({
  declarations: [LoginComponent, LoginFormComponent, RegisterFormComponent],
  imports: [
    SharedModule,
    CommonModule,
    LoginRoutingModule,
    ReactiveFormsModule,
    StoreModule.forFeature('auth', loginReducers),
    EffectsModule.forFeature([LoginEffects]),
  ],
  providers: [CookieServiceService],
  bootstrap: [LoginComponent],
})
export class LoginModule {}
