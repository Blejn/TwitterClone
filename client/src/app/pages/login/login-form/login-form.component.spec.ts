import { HttpClient, HttpHandler } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserLogin } from 'src/app/interfaces/UserLogin';
import { LoginFormComponent } from './login-form.component';

let comp: LoginFormComponent;
fdescribe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule],
      providers: [
        FormBuilder,
        HttpClientTestingModule,
        HttpClient,
        HttpHandler,
      ],
      declarations: [LoginFormComponent],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(LoginFormComponent);
        comp = fixture.componentInstance;
      });

    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function updateForm(userEmail: string, userPassword: string) {
    comp.loginForm.controls['email'].setValue(userEmail);
    comp.loginForm.controls['password'].setValue(userPassword);
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form invalid when empty', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('username field validity', () => {
    let username = component.loginForm.controls['username'];
    1;
    expect(username.valid).toBeFalsy();
    2;
  });

  it('username field validity (required)', () => {
    let username = component.loginForm.controls['username'];
    let err = username.errors || null;
    expect(err?.['required']).toBeTruthy();
  });

  it('submitting a form emits a user', () => {
    let user!: UserLogin;
    expect(component.loginForm.valid).toBeFalsy();
    component.loginForm.controls['username'].setValue('ejdsdan');
    component.loginForm.controls['password'].setValue('12389');
    expect(component.loginForm.invalid).toBeTruthy();

    component.loggedIn.subscribe((value) => (user = value));

    expect(user.username).toBe('ejdsdan');
    expect(user.password).toBe('12389');
  });
});
