import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  isLoginMode: boolean = false;
  constructor() {}

  ngOnInit(): void {}
  changeMode(event: boolean) {
    this.isLoginMode = event;
  }
}
