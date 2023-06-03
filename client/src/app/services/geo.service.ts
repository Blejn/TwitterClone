import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GeoService {
  constructor(private http: HttpClient) {}

  getLocation() {
    return;
  }
}
