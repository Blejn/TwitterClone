import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isDarkTheme!: Observable<boolean>;
  constructor(
    private router: Router,
    private themeService: ThemeService,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang('en');
  }
  title = 'client';

  ngOnInit(): void {
    this.isDarkTheme = this.themeService.isDarkTheme;
  }
  onActive(event: any) {
    console.log('activate', event);
  }
  onDeactive(event: any) {
    console.log('deactive', event);
  }
}
