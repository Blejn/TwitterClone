import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private _darkTheme = new Subject<boolean>();
  isDarkTheme = this._darkTheme;

  setDarkTheme(isDarkTheme: boolean): void {
    this.isDarkTheme.next(isDarkTheme);
  }

  constructor() {}
}
