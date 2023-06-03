import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CookieServiceService } from 'src/app/services/cookie-service.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
})
export class PostsComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private cookieService: CookieServiceService
  ) {
    console.log(this.cookieService.getUserDetails());
  }

  post!: string | null;
  ngOnInit(): void {
    this.route.paramMap.subscribe((param) => (this.post = param.get('id'))); // lepsze  i wydajniejsze niz korzystanie ze snapchota
  }
}
