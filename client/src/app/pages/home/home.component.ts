import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(private router: Router, private translate: TranslateService) {
    this.translate.setDefaultLang('en');
  }

  ngOnInit(): void {}
  goLoginpage() {
    this.router.navigate(['/login']);
  }
}
