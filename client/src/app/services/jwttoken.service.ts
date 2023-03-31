import { Injectable } from '@angular/core';
import jwtDecode from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class JWTTokenService {
  jwtToken!: string;
  decodedToken!: { [key: string]: string };

  constructor() {}

  decodeToken = (jwtToken: string) => {
    return jwtDecode(jwtToken);
  };

  // getLoggedUser() {
  //   this.decodeToken();
  //   return this.decodedToken ? this.decodedToken?.['user'] : null;
  // }
  // getExpiryTime() {
  //   this.decodeToken();
  //   return this.decodedToken ? this.decodedToken?.['exp'] : null;
  // }
}
