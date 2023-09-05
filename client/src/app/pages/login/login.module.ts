import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { LoginFormComponent } from './login-form/login-form.component';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { RegisterFormComponent } from './register-form/register-form.component';

@NgModule({
  declarations: [LoginComponent, LoginFormComponent, RegisterFormComponent],
  imports: [
    SharedModule,
    CommonModule,
    LoginRoutingModule,
    ReactiveFormsModule,
    // StoreModule.forFeature('login', reducers),
  ],
  providers: [],
  bootstrap: [LoginComponent],
})
export class LoginModule {}
