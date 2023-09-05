import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { UserLogin } from '../interfaces/UserLogin';
import { UserRegister } from '../interfaces/UserRegister';
import { AuthService } from './auth.service';
import { CookieServiceService } from './cookie-service.service';
import { JWTTokenService } from './jwttoken.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        AuthService,
        JWTTokenService,
        CookieServiceService,
        ToastrService,
      ],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a user', () => {
    const mockUser: UserRegister = {
      firstname: 'Sebastian',
      lastname: 'Mazur',
      username: 'Blejn',
      email: 'swagmazur@gmail.com',
      password: 'Sebula1234!',
      profile_picture: 'profile.jpg',
      location: 'Katowice',
    };
    service.register(mockUser).subscribe((response) => {
      expect(response).toEqual(mockUser);
    });
    const req = httpMock.expectOne(`${environment.API_URL}/auth/user/register`);
    expect(req.request.method).toBe('POST');
    req.flush(mockUser);
  });

  it('should log in a user', () => {
    const mockUserLogin: UserLogin = {
      username: 'blejn',
      password: '123456789',
    };

    service.login(mockUserLogin);

    const req = httpMock.expectOne(`${environment.API_URL}/auth/user/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockUserLogin); // Mock the response

    expect(service.isLoggedIn).toBeTrue();
    // Test other expectations
  });
});
